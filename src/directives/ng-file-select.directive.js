"use strict";
exports.__esModule = true;
var core_1 = require("@angular/core");
var ngx_uploader_class_1 = require("../classes/ngx-uploader.class");
var NgFileSelectDirective = (function () {
    function NgFileSelectDirective(elementRef) {
        var _this = this;
        this.elementRef = elementRef;
        this.fileListener = function () {
            if (_this.el.files) {
                _this.upload.handleFiles(_this.el.files);
            }
        };
        this.uploadOutput = new core_1.EventEmitter();
    }
    NgFileSelectDirective.prototype.ngOnInit = function () {
        var _this = this;
        this._sub = [];
        var concurrency = this.options && this.options.concurrency || Number.POSITIVE_INFINITY;
        var allowedContentTypes = this.options && this.options.allowedContentTypes || ['*'];
        this.upload = new ngx_uploader_class_1.NgUploaderService(concurrency, allowedContentTypes);
        this.el = this.elementRef.nativeElement;
        this.el.addEventListener('change', this.fileListener, false);
        this._sub.push(this.upload.serviceEvents.subscribe(function (event) {
            _this.uploadOutput.emit(event);
        }));
        if (this.uploadInput instanceof core_1.EventEmitter) {
            this._sub.push(this.upload.initInputEvents(this.uploadInput));
        }
    };
    NgFileSelectDirective.prototype.ngOnDestroy = function () {
        this.el.removeEventListener('change', this.fileListener, false);
        this._sub.forEach(function (sub) { return sub.unsubscribe(); });
    };
    NgFileSelectDirective.decorators = [
        { type: core_1.Directive, args: [{
                    selector: '[ngFileSelect]'
                },] },
    ];
    /** @nocollapse */
    NgFileSelectDirective.ctorParameters = function () { return [
        { type: core_1.ElementRef },
    ]; };
    NgFileSelectDirective.propDecorators = {
        'options': [{ type: core_1.Input },],
        'uploadInput': [{ type: core_1.Input },],
        'uploadOutput': [{ type: core_1.Output },]
    };
    return NgFileSelectDirective;
}());
exports.NgFileSelectDirective = NgFileSelectDirective;
