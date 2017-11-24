"use strict";
exports.__esModule = true;
var core_1 = require("@angular/core");
var ngx_uploader_class_1 = require("../classes/ngx-uploader.class");
var NgFileDropDirective = (function () {
    function NgFileDropDirective(elementRef) {
        this.elementRef = elementRef;
        this.stopEvent = function (e) {
            e.stopPropagation();
            e.preventDefault();
        };
        this.uploadOutput = new core_1.EventEmitter();
    }
    NgFileDropDirective.prototype.ngOnInit = function () {
        var _this = this;
        this._sub = [];
        var concurrency = this.options && this.options.concurrency || Number.POSITIVE_INFINITY;
        var allowedContentTypes = this.options && this.options.allowedContentTypes || ['*'];
        var allowFile = this.options.allowFile;
        this.upload = new ngx_uploader_class_1.NgUploaderService(concurrency, allowedContentTypes, allowFile);
        this.el = this.elementRef.nativeElement;
        this._sub.push(this.upload.serviceEvents.subscribe(function (event) {
            _this.uploadOutput.emit(event);
        }));
        if (this.uploadInput instanceof core_1.EventEmitter) {
            this._sub.push(this.upload.initInputEvents(this.uploadInput));
        }
        this.el.addEventListener('drop', this.stopEvent, false);
        this.el.addEventListener('dragenter', this.stopEvent, false);
        this.el.addEventListener('dragover', this.stopEvent, false);
    };
    NgFileDropDirective.prototype.ngOnDestroy = function () {
        this._sub.forEach(function (sub) { return sub.unsubscribe(); });
    };
    NgFileDropDirective.prototype.onDrop = function (e) {
        e.stopPropagation();
        e.preventDefault();
        var event = { type: 'drop' };
        this.uploadOutput.emit(event);
        this.upload.handleFiles(e.dataTransfer.files);
    };
    NgFileDropDirective.prototype.onDragOver = function (e) {
        if (!e) {
            return;
        }
        var event = { type: 'dragOver' };
        this.uploadOutput.emit(event);
    };
    NgFileDropDirective.prototype.onDragLeave = function (e) {
        if (!e) {
            return;
        }
        var event = { type: 'dragOut' };
        this.uploadOutput.emit(event);
    };
    NgFileDropDirective.decorators = [
        { type: core_1.Directive, args: [{
                    selector: '[ngFileDrop]'
                },] },
    ];
    /** @nocollapse */
    NgFileDropDirective.ctorParameters = function () { return [
        { type: core_1.ElementRef },
    ]; };
    NgFileDropDirective.propDecorators = {
        'options': [{ type: core_1.Input },],
        'uploadInput': [{ type: core_1.Input },],
        'uploadOutput': [{ type: core_1.Output },],
        'onDrop': [{ type: core_1.HostListener, args: ['drop', ['$event'],] },],
        'onDragOver': [{ type: core_1.HostListener, args: ['dragover', ['$event'],] },],
        'onDragLeave': [{ type: core_1.HostListener, args: ['dragleave', ['$event'],] },]
    };
    return NgFileDropDirective;
}());
exports.NgFileDropDirective = NgFileDropDirective;
