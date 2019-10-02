"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose = require("mongoose");
var moment_1 = require("moment");
var Schema = mongoose.Schema;
var usersSchemas = new Schema({
    _id: Schema.Types.ObjectId,
    name: String,
    password: String,
    avatar: {
        type: String,
        default: 'http://egret.oss-cn-beijing.aliyuncs.com/i_4_2246533969x3386744293_21.jpg'
    },
    articles: [{
            type: Schema.Types.ObjectId,
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
var Users = mongoose.model('Users', usersSchemas);
exports.default = Users;
