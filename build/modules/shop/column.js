"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose_1 = require("mongoose");
var moment = require("moment");
var adminMongodb_1 = require("../../config/adminMongodb");
var columnSchema = new mongoose_1.Schema({
    _id: mongoose_1.Schema.Types.ObjectId,
    column_id: mongoose_1.Schema.Types.ObjectId,
    column_name: String,
    column_desc: {
        type: String,
        default: ''
    },
    meta: {
        createAt: Date,
        updateAt: Date
    }
});
columnSchema.pre('save', function (next) {
    if (this.isNew) {
        this.meta.createAt = this.meta.updateAt = moment();
    }
    else {
        this.meta.updateAt = moment();
    }
    next();
});
exports.default = adminMongodb_1.connection.model('Column', columnSchema);
