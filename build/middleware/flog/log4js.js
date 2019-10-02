"use strict";
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
Object.defineProperty(exports, "__esModule", { value: true });
function isOnline() {
    return process.env['WCloud_Env'] == 'Product';
}
function log(type, sys) {
    var args = [];
    for (var _i = 2; _i < arguments.length; _i++) {
        args[_i - 2] = arguments[_i];
    }
    var myc = "\x1B[0;32m";
    if (type == 'DEBUG') {
        myc = "\x1B[0;33m";
    }
    else if (type == 'ERROR') {
        myc = "\x1B[0;31m";
    }
    var time = "[" + new Date().toLocaleString() + "]";
    var msg = myc + time + myc + " " + type + " " + myc + sys;
    console.log.apply(console, __spreadArrays([msg, '\x1B[0m-'], args));
}
var Log4js = (function () {
    function Log4js(category, level) {
        this.isOnline = false;
        this.category = category;
        this.isOnline = isOnline();
    }
    Log4js.prototype.log = function () {
        var arg = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            arg[_i] = arguments[_i];
        }
        log.apply(void 0, __spreadArrays(['INFO', this.category], arg));
    };
    Log4js.prototype.err = function () {
        var arg = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            arg[_i] = arguments[_i];
        }
        log.apply(void 0, __spreadArrays(['ERROR', this.category], arg));
    };
    Log4js.prototype.debug = function () {
        var arg = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            arg[_i] = arguments[_i];
        }
        if (!this.isOnline) {
            log.apply(void 0, __spreadArrays(['DEBUG', this.category], arg));
        }
    };
    return Log4js;
}());
exports.default = Log4js;
