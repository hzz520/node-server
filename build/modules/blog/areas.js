"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose_1 = require("mongoose");
var blogsMongodb_1 = require("../../config/blogsMongodb");
var AreasSchemas = new mongoose_1.Schema({
    _id: mongoose_1.Schema.Types.ObjectId,
    code: Number,
    pcode: Number,
    name: String
});
exports.default = blogsMongodb_1.connection.model('Areas', AreasSchemas);
