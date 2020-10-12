"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var ali_oss_1 = __importDefault(require("ali-oss"));
exports.default = new ali_oss_1.default({
    region: 'oss-cn-beijing',
    accessKeyId: 'LTAIljCW8uhGqpGV',
    accessKeySecret: 'mTEPn800OTUqvFkTnVttPJZEsBxE3x',
    bucket: 'egret'
});
