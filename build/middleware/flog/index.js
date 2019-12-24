"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var log4js_1 = __importDefault(require("./log4js"));
function getStr(msg, req, res) {
    var array = msg.split(' ');
    var tokenMap = {
        ":url": getUrls(req),
        ":protocol": req.protocol,
        ":hostname": req.hostname,
        ":method": req.method,
        ":status": res.__statusCode || res.statusCode,
        ":response-time": res.responseTime,
        ":date": new Date().toLocaleString(),
        ":referrer": req.headers.referer || req.headers.referrer || '',
        ":remote-addr": req.headers['x-forwarded-for'] || req.ip || req._remoteAddress || (req.socket && (req.socket.remoteAddress || (req.socket.socket && req.socket.socket.remoteAddress))),
        ":user-agent": req.headers['user-agent']
    };
    var retArray = [];
    array.filter(function (item) {
        var replaceToken = tokenMap[item];
        if (/^:/.test(item)) {
            retArray.push(replaceToken || '');
        }
        else {
            retArray.push(item);
        }
    });
    return retArray.join(' ');
}
;
function getUrls(req) {
    return req.originalUrl || req.url;
}
var Flog;
(function (Flog) {
    function getLog(category, level) {
        var logger = new log4js_1.default(category, level || this.level);
        return logger;
    }
    Flog.getLog = getLog;
    function express() {
        var logger = new log4js_1.default('SYSTEM');
        return function (req, res, next) {
            var start = +new Date();
            res.on('finish', function () {
                res.responseTime = (+new Date() - start) + "ms";
                var str = ':method :url :status :response-time';
                var logstr = getStr(str, req, res);
                logger.log(logstr);
            });
            return next();
        };
    }
    Flog.express = express;
})(Flog || (Flog = {}));
module.exports = Flog;
