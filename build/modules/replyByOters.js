"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var replyByOtherSchema = new Schema({
    _id: Schema.Types.ObjectId,
    avatar: {
        type: Schema.Types.ObjectId,
        ref: 'Users'
    },
    answerBy: String,
    answerTo: String,
    message: String,
    time: String
});
var replyByOther = mongoose.model('replybyothers', replyByOtherSchema);
exports.default = replyByOther;
