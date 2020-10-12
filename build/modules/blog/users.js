"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var moment_1 = __importDefault(require("moment"));
var mongoose_1 = require("mongoose");
var blogsMongodb_1 = require("../../config/blogsMongodb");
var usersSchemas = new mongoose_1.Schema({
    _id: mongoose_1.Schema.Types.ObjectId,
    name: String,
    password: String,
    avatar: {
        type: String,
        default: '//egret.oss-cn-beijing.aliyuncs.com/i_4_2246533969x3386744293_21.jpg'
    },
    articles: [{
            type: mongoose_1.Schema.Types.ObjectId,
            ref: 'ArticleList'
        }],
    meta: {
        createAt: Date,
        updateAt: Date
    }
});
usersSchemas.pre('save', function (next) {
    if (this.isNew) {
        this.meta.createAt = this.meta.updateAt = moment_1.default();
    }
    else {
        this.meta.updateAt = moment_1.default();
    }
    next();
});
exports.default = blogsMongodb_1.connection.model('Users', usersSchemas);
