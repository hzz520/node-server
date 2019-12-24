"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose_1 = require("mongoose");
var blogsMongodb_1 = require("../../config/blogsMongodb");
var replyByOtherSchema = new mongoose_1.Schema({
    _id: mongoose_1.Schema.Types.ObjectId,
    avatar: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Users'
    },
    answerBy: String,
    answerTo: String,
    message: String,
    time: String
});
exports.default = blogsMongodb_1.connection.model('replybyothers', replyByOtherSchema);
