"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose_1 = require("mongoose");
var moment_1 = __importDefault(require("moment"));
var blogsMongodb_1 = require("../../config/blogsMongodb");
var articleListSchemas = new mongoose_1.Schema({
    _id: mongoose_1.Schema.Types.ObjectId,
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
            type: mongoose_1.Schema.Types.ObjectId,
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
exports.default = blogsMongodb_1.connection.model('ArticleList', articleListSchemas);
