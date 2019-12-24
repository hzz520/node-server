"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose = require("mongoose");
var Flog = require("../middleware/flog/index");
exports.connection = mongoose.createConnection("mongodb://hzz.letin2586.com:27017", {
    user: 'aliyun',
    pass: '1h2z3z2325076',
    dbName: 'shop',
    authSource: 'admin',
    useNewUrlParser: true,
    useUnifiedTopology: true
});
exports.connection.on('error', function () {
    Flog.getLog('MONGDB').err('mongoose connection blogs error');
});
exports.connection.on('connected', function () {
    Flog.getLog('MONGDB').debug('mongoose connection blogs success');
});
