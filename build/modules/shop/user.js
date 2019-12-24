"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose_1 = require("mongoose");
var adminMongodb_1 = require("../../config/adminMongodb");
var moment_1 = __importDefault(require("moment"));
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
        default: '//egret.oss-cn-beijing.aliyuncs.com/i_4_2246533969x3386744293_21.jpg'
    },
    meta: {
        createAt: Date,
        updateAt: Date
    }
});
userSchema.pre('save', function (next) {
    if (this.isNew) {
        this.meta.createAt = this.meta.updateAt = moment_1.default();
    }
    else {
        this.meta.updateAt = moment_1.default();
    }
    next();
});
exports.default = adminMongodb_1.connection.model('User', userSchema);
