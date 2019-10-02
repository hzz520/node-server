"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose_1 = require("mongoose");
var moment = require("moment");
var userSchema = new mongoose_1.Schema({
    _id: mongoose_1.Schema.Types.ObjectId,
    username: String,
    password: String,
    permission: {
        type: String,
        default: '-'
    },
    permission_id: {
        type: String,
        default: ''
    },
    role: {
        type: Number,
        default: 0
    },
    avatar: {
        type: String,
        default: 'http://egret.oss-cn-beijing.aliyuncs.com/i_4_2246533969x3386744293_21.jpg'
    },
    meta: {
        createAt: Date,
        updateAt: Date
    }
});
userSchema.pre('save', function (next) {
    if (this.isNew) {
        this.meta.createAt = this.meta.updateAt = moment();
    }
    else {
        this.meta.updateAt = moment();
    }
    next();
});
exports.default = mongoose_1.model('User', userSchema);
