"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var moment = require("moment");
var mongoose_1 = require("mongoose");
var subConnnection_1 = require("../../config/subConnnection");
var usersSchemas = new mongoose_1.Schema({
    _id: mongoose_1.Schema.Types.ObjectId,
    name: String,
    password: String,
    avatar: {
        type: String,
        default: 'http://egret.oss-cn-beijing.aliyuncs.com/i_4_2246533969x3386744293_21.jpg'
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
        this.meta.createAt = this.meta.updateAt = moment();
    }
    else {
        this.meta.updateAt = moment();
    }
    next();
});
exports.default = subConnnection_1.connection.model('Users', usersSchemas);
