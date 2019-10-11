"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose_1 = require("mongoose");
var blogsMongodb_1 = require("../../config/blogsMongodb");
var commentSchema = new mongoose_1.Schema({
    _id: mongoose_1.Schema.Types.ObjectId,
    reply: {
        name: String,
        avatar: {
            type: mongoose_1.Schema.Types.ObjectId,
            ref: 'Users'
        },
        message: String,
        time: String
    },
    replyByOther: [{
            type: mongoose_1.Schema.Types.ObjectId,
            ref: 'replybyothers'
        }]
});
exports.default = blogsMongodb_1.connection.model('comments', commentSchema);
