"use strict";
exports.__esModule = true;
var UploadStatus;
(function (UploadStatus) {
    UploadStatus[UploadStatus["Queue"] = 0] = "Queue";
    UploadStatus[UploadStatus["Uploading"] = 1] = "Uploading";
    UploadStatus[UploadStatus["Done"] = 2] = "Done";
    UploadStatus[UploadStatus["Cancelled"] = 3] = "Cancelled";
})(UploadStatus = exports.UploadStatus || (exports.UploadStatus = {}));
