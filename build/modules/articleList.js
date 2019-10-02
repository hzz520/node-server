"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose = require("mongoose");
var moment_1 = require("moment");
var Schema = mongoose.Schema;
var articleListSchemas = new Schema({
    _id: Schema.Types.ObjectId,
    name: String,
    title: String,
    content: String,
    category: String,
    pv: {
        type: Number,
        default: 0
    },
    cover: String,
    comments: [{
            type: Schema.Types.ObjectId,
            ref: 'comments'
        }],
    praises: {
        type: [String],
        default: []
    },
    time: {
        date: Date,
        day: String,
        minute: String,
        month: String,
        year: String
    }
});
articleListSchemas.pre('save', function (next) {
    if (this.isNew) {
        var t = moment_1.default();
        this.time = {
            date: t,
            day: t.format('YYYY-MM-DD'),
            minute: t.format('YYYY-MM-DD HH:mm'),
            month: t.format('YYYY-MM'),
            year: t.format('YYYY')
        };
    }
    next();
});
var ArticleList = mongoose.model('ArticleList', articleListSchemas);
exports.default = ArticleList;
