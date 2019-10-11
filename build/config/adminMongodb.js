"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose = require("mongoose");
var Flog = require("../middleware/flog/index");
exports.connection = mongoose.createConnection("mongodb://127.0.0.1:27017", {
    user: 'aliyun',
    pass: '1h2z3z2325076',
    dbName: 'wxShop',
    authSource: 'admin',
    useNewUrlParser: true,
    useUnifiedTopology: true
});
exports.connection.on('error', function () {
    Flog.getLog('MONGDB').err('Mongoose connection admin error');
});
exports.connection.on('connected', function () {
    Flog.getLog('MONGDB').debug('Mongoose connection admin success');
});
