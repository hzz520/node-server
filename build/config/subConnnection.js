"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose = require("mongoose");
exports.connection = mongoose.createConnection("mongodb://root:root@127.0.0.1:27017/shop?authSource=admin", {
    useNewUrlParser: true,
    useUnifiedTopology: true
});
exports.connection.on('error', function () {
    console.log('subMongoose connection error');
});
exports.connection.on('connected', function () {
    console.log('subMongoose connection success');
});
