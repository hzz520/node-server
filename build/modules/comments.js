"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var commentSchema = new Schema({
    _id: Schema.Types.ObjectId,
    reply: {
        name: String,
        avatar: {
            type: Schema.Types.ObjectId,
            ref: 'Users'
        },
        message: String,
        time: String
    },
    replyByOther: [{
            type: Schema.Types.ObjectId,
            ref: 'replybyothers'
        }]
});
var comment = mongoose.model('comments', commentSchema);
exports.default = comment;
