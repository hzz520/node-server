"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose = require("mongoose");
exports.connection = mongoose.createConnection("mongodb://47.94.193.216:27017/shop", {
    useNewUrlParser: true,
    useUnifiedTopology: true
});
