"use strict";
exports.__esModule = true;
var core_1 = require("@angular/core");
var Observable_1 = require("rxjs/Observable");
var Subject_1 = require("rxjs/Subject");
require("rxjs/add/operator/mergeMap");
var interfaces_1 = require("./interfaces");
function humanizeBytes(bytes) {
    if (bytes === 0) {
        return '0 Byte';
    }
    var k = 1024;
    var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB'];
    var i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}
exports.humanizeBytes = humanizeBytes;
var NgUploaderService = (function () {
    function NgUploaderService(concurrency, contentTypes, allowFile) {
        if (concurrency === void 0) { concurrency = Number.POSITIVE_INFINITY; }
        if (contentTypes === void 0) { contentTypes = ['*']; }
        if (allowFile === void 0) { allowFile = function (file) { return false; }; }
        var _this = this;
        this.queue = [];
        this.serviceEvents = new core_1.EventEmitter();
        this.uploadScheduler = new Subject_1.Subject();
        this.subs = [];
        this.contentTypes = contentTypes;
        this.allowFile = allowFile;
        this.uploadScheduler
            .mergeMap(function (upload) { return _this.startUpload(upload); }, concurrency)
            .subscribe(function (uploadOutput) { return _this.serviceEvents.emit(uploadOutput); });
    }
    NgUploaderService.prototype.handleFiles = function (incomingFiles) {
        var _this = this;
        var allowedIncomingFiles = [].reduce.call(incomingFiles, function (acc, checkFile, i) {
            if (_this.isContentTypeAllowed(checkFile.type) && _this.allowFile) {
                acc = acc.concat(checkFile);
            }
            else {
                var rejectedFile = _this.makeUploadFile(checkFile, i);
                _this.serviceEvents.emit({ type: 'rejected', file: rejectedFile });
            }
            return acc;
        }, []);
        (_a = this.queue).push.apply(_a, [].map.call(allowedIncomingFiles, function (file, i) {
            var uploadFile = _this.makeUploadFile(file, i);
            _this.serviceEvents.emit({ type: 'addedToQueue', file: uploadFile });
            return uploadFile;
        }));
        this.serviceEvents.emit({ type: 'allAddedToQueue' });
        var _a;
    };
    NgUploaderService.prototype.initInputEvents = function (input) {
        var _this = this;
        return input.subscribe(function (event) {
            switch (event.type) {
                case 'uploadFile':
                    var uploadFileIndex = _this.queue.findIndex(function (file) { return file === event.file; });
                    if (uploadFileIndex !== -1 && event.file) {
                        _this.uploadScheduler.next({ file: _this.queue[uploadFileIndex], event: event });
                    }
                    break;
                case 'uploadAll':
                    var files = _this.queue.filter(function (file) { return file.progress.status === interfaces_1.UploadStatus.Queue; });
                    files.forEach(function (file) { return _this.uploadScheduler.next({ file: file, event: event }); });
                    break;
                case 'cancel':
                    var id_1 = event.id || null;
                    if (!id_1) {
                        return;
                    }
                    var index = _this.subs.findIndex(function (sub) { return sub.id === id_1; });
                    if (index !== -1 && _this.subs[index].sub) {
                        _this.subs[index].sub.unsubscribe();
                        var fileIndex = _this.queue.findIndex(function (file) { return file.id === id_1; });
                        if (fileIndex !== -1) {
                            _this.queue[fileIndex].progress.status = interfaces_1.UploadStatus.Cancelled;
                            _this.serviceEvents.emit({ type: 'cancelled', file: _this.queue[fileIndex] });
                        }
                    }
                    break;
                case 'cancelAll':
                    _this.subs.forEach(function (sub) {
                        if (sub.sub) {
                            sub.sub.unsubscribe();
                        }
                        var file = _this.queue.find(function (uploadFile) { return uploadFile.id === sub.id; });
                        if (file) {
                            file.progress.status = interfaces_1.UploadStatus.Cancelled;
                            _this.serviceEvents.emit({ type: 'cancelled', file: file });
                        }
                    });
                    break;
                case 'remove':
                    if (!event.id) {
                        return;
                    }
                    var i = _this.queue.findIndex(function (file) { return file.id === event.id; });
                    if (i !== -1) {
                        var file = _this.queue[i];
                        _this.queue.splice(i, 1);
                        _this.serviceEvents.emit({ type: 'removed', file: file });
                    }
                    break;
                case 'removeAll':
                    if (_this.queue.length) {
                        _this.queue = [];
                        _this.serviceEvents.emit({ type: 'removedAll' });
                    }
                    break;
            }
        });
    };
    NgUploaderService.prototype.startUpload = function (upload) {
        var _this = this;
        return new Observable_1.Observable(function (observer) {
            var sub = _this.uploadFile(upload.file, upload.event)
                .subscribe(function (output) {
                observer.next(output);
            }, function (err) {
                observer.error(err);
                observer.complete();
            }, function () {
                observer.complete();
            });
            _this.subs.push({ id: upload.file.id, sub: sub });
        });
    };
    NgUploaderService.prototype.uploadFile = function (file, event) {
        var _this = this;
        return new Observable_1.Observable(function (observer) {
            var url = event.url || '';
            var method = event.method || 'POST';
            var data = event.data || {};
            var headers = event.headers || {};
            var xhr = new XMLHttpRequest();
            var time = new Date().getTime();
            var progressStartTime = (file.progress.data && file.progress.data.startTime) || time;
            var speed = 0;
            var eta = null;
            xhr.upload.addEventListener('progress', function (e) {
                if (e.lengthComputable) {
                    var percentage = Math.round((e.loaded * 100) / e.total);
                    var diff = new Date().getTime() - time;
                    speed = Math.round(e.loaded / diff * 1000);
                    progressStartTime = (file.progress.data && file.progress.data.startTime) || new Date().getTime();
                    eta = Math.ceil((e.total - e.loaded) / speed);
                    file.progress = {
                        status: interfaces_1.UploadStatus.Uploading,
                        data: {
                            percentage: percentage,
                            speed: speed,
                            speedHuman: humanizeBytes(speed) + "/s",
                            startTime: progressStartTime,
                            endTime: null,
                            eta: eta,
                            etaHuman: _this.secondsToHuman(eta)
                        }
                    };
                    observer.next({ type: 'uploading', file: file });
                }
            }, false);
            xhr.upload.addEventListener('error', function (e) {
                observer.error(e);
                observer.complete();
            });
            xhr.onreadystatechange = function () {
                if (xhr.readyState === XMLHttpRequest.DONE) {
                    var speedAverage = Math.round(file.size / (new Date().getTime() - progressStartTime) * 1000);
                    file.progress = {
                        status: interfaces_1.UploadStatus.Done,
                        data: {
                            percentage: 100,
                            speed: speedAverage,
                            speedHuman: humanizeBytes(speedAverage) + "/s",
                            startTime: progressStartTime,
                            endTime: new Date().getTime(),
                            eta: eta,
                            etaHuman: _this.secondsToHuman(eta || 0)
                        }
                    };
                    file.responseStatus = xhr.status;
                    try {
                        file.response = JSON.parse(xhr.response);
                    }
                    catch (e) {
                        file.response = xhr.response;
                    }
                    observer.next({ type: 'done', file: file });
                    observer.complete();
                }
            };
            xhr.open(method, url, true);
            xhr.withCredentials = event.withCredentials ? true : false;
            try {
                var uploadFile_1 = file.nativeFile;
                var uploadIndex = _this.queue.findIndex(function (outFile) { return outFile.nativeFile === uploadFile_1; });
                if (_this.queue[uploadIndex].progress.status === interfaces_1.UploadStatus.Cancelled) {
                    observer.complete();
                }
                file.form.append(event.fieldName || 'file', uploadFile_1, uploadFile_1.name);
                Object.keys(data).forEach(function (key) { return file.form.append(key, data[key]); });
                Object.keys(headers).forEach(function (key) { return xhr.setRequestHeader(key, headers[key]); });
                _this.serviceEvents.emit({ type: 'start', file: file });
                xhr.send(file.form);
            }
            catch (e) {
                observer.complete();
            }
            return function () {
                xhr.abort();
            };
        });
    };
    NgUploaderService.prototype.secondsToHuman = function (sec) {
        return new Date(sec * 1000).toISOString().substr(11, 8);
    };
    NgUploaderService.prototype.generateId = function () {
        return Math.random().toString(36).substring(7);
    };
    NgUploaderService.prototype.setContentTypes = function (contentTypes) {
        if (typeof contentTypes !== 'undefined' && contentTypes instanceof Array) {
            if (contentTypes.find(function (type) { return type === '*'; }) !== undefined) {
                this.contentTypes = ['*'];
            }
            else {
                this.contentTypes = contentTypes;
            }
            return;
        }
        this.contentTypes = ['*'];
    };
    NgUploaderService.prototype.allContentTypesAllowed = function () {
        return this.contentTypes.find(function (type) { return type === '*'; }) !== undefined;
    };
    NgUploaderService.prototype.isContentTypeAllowed = function (mimetype) {
        if (this.allContentTypesAllowed()) {
            return true;
        }
        return this.contentTypes.find(function (type) { return type === mimetype; }) !== undefined;
    };
    NgUploaderService.prototype.makeUploadFile = function (file, index) {
        return {
            fileIndex: index,
            id: this.generateId(),
            name: file.name,
            size: file.size,
            type: file.type,
            form: new FormData(),
            progress: {
                status: interfaces_1.UploadStatus.Queue,
                data: {
                    percentage: 0,
                    speed: 0,
                    speedHuman: humanizeBytes(0) + "/s",
                    startTime: null,
                    endTime: null,
                    eta: null,
                    etaHuman: null
                }
            },
            lastModifiedDate: file.lastModifiedDate,
            sub: undefined,
            nativeFile: file
        };
    };
    return NgUploaderService;
}());
exports.NgUploaderService = NgUploaderService;
