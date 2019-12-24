"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose_1 = require("mongoose");
var moment_1 = __importDefault(require("moment"));
var adminMongodb_1 = require("../../config/adminMongodb");
var activiteSchema = new mongoose_1.Schema({
    _id: mongoose_1.Schema.Types.ObjectId,
    activite_id: mongoose_1.Schema.Types.ObjectId,
    activite_name: String,
    activite_rank: String,
    activite_desc: String,
    meta: {
        createAt: Date,
        updateAt: Date
    }
});
activiteSchema.pre('save', function (next) {
    if (this.isNew) {
        this.meta.createAt = this.meta.updateAt = moment_1.default();
    }
    else {
        this.meta.updateAt = moment_1.default();
    }
    next();
});
exports.default = adminMongodb_1.connection.model('Activite', activiteSchema);
