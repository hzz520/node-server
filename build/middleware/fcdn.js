"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var path_1 = require("path");
var glob_1 = require("glob");
var isDev = process.env.NODE_ENV === 'development';
var Fcdn = (function () {
    function Fcdn() {
    }
    Fcdn.outPath = function (pathname) {
        var dir = path_1.dirname(path_1.join(isDev ? '/Aliyun' : '/opt', pathname.replace('/static', '')));
        var filename = path_1.basename(pathname);
        var ext = path_1.extname(pathname);
        var base = filename.replace(ext, '');
        var paths = glob_1.sync('*' + ext, { cwd: dir });
        var reg = new RegExp("^" + base + "-[0-9a-zA-Z]{1,}" + ext + "$");
        return path_1.dirname(pathname) + '/' + paths.find(function (key) { return reg.test(key); });
    };
    return Fcdn;
}());
exports.default = (function (req, res, next) {
    req.fcdn = Fcdn;
    next();
});
