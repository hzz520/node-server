"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose_1 = require("mongoose");
var adminMongodb_1 = require("../../config/adminMongodb");
var moment_1 = __importDefault(require("moment"));
var projectSchema = new mongoose_1.Schema({
    project_id: String,
    project_name: String,
    project_cover: String,
    meta: {
        createAt: Date,
        updateAt: Date
    }
});
projectSchema.pre('save', function (next) {
    if (this.isNew) {
        this.meta.createAt = this.meta.updateAt = moment_1.default();
    }
    else {
        this.meta.updateAt = moment_1.default();
    }
    next();
});
exports.default = adminMongodb_1.connection.model('Project', projectSchema);
