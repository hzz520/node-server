"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose = require("mongoose");
var Flog = require("../middleware/flog/index");
exports.connection = mongoose.createConnection("mongodb://aliyun:1h2z3z2325076@127.0.0.1:27017/shop?authSource=admin", {
    useNewUrlParser: true,
    useUnifiedTopology: true
});
exports.connection.on('error', function () {
    Flog.getLog('MONGDB').err('subMongoose connection error');
});
exports.connection.on('connected', function () {
    Flog.getLog('MONGDB').debug('subMongoose connection success');
});
