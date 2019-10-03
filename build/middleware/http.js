"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
var axios_1 = require("axios");
var querystring_1 = require("querystring");
var Flog = require("../middleware/flog/index");
var Axios = (function () {
    function Axios() {
    }
    Axios.get = function (url, data, config) {
        var _this = this;
        if (data === void 0) { data = {}; }
        if (config === void 0) { config = {}; }
        var strArr = url.split('?');
        var str = strArr[1] + querystring_1.stringify(data);
        url = strArr[0] + '?' + str;
        return axios_1.default.get(url, __assign(__assign({}, this.defaultConfig), config))
            .then(function (res) { return res.data; })
            .catch(function (err) {
            _this.handleError(err);
            return err;
        });
    };
    Axios.post = function (url, data, config) {
        var _this = this;
        return axios_1.default.post(url, data, __assign(__assign({}, this.defaultConfig), config))
            .then(function (res) { return res.data; })
            .catch(function (err) {
            _this.handleError(err);
            return err;
        });
    };
    Axios.handleError = function (err) {
        Flog.getLog('ERROR').err(err);
    };
    Axios.express = function () {
        return function (req, res, next) {
            req.Axios = Axios;
            next();
        };
    };
    Axios.defaultConfig = {
        headers: {
            'content-type': 'application/json;charset=utf-8'
        }
    };
    return Axios;
}());
exports.Axios = Axios;
