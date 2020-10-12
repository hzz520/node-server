"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose_1 = require("mongoose");
var adminMongodb_1 = require("../../config/adminMongodb");
var moment_1 = __importDefault(require("moment"));
var goodSchema = new mongoose_1.Schema({
    _id: mongoose_1.Schema.Types.ObjectId,
    good_id: mongoose_1.Schema.Types.ObjectId,
    good_name: String,
    good_activite_ids: [{
            type: mongoose_1.Schema.Types.ObjectId,
            ref: 'Activite'
        }],
    good_column_ids: [{
            type: mongoose_1.Schema.Types.ObjectId,
            ref: 'Column'
        }],
    good_desc: String,
    good_imgs: [{ type: String }],
    good_oprice: String,
    good_sprice: String,
    good_dSaleCount: String,
    good_oSaleCount: {
        type: String,
        default: '0'
    },
    good_status: String,
    meta: {
        createAt: Date,
        updateAt: Date
    }
});
goodSchema.pre('save', function (next) {
    if (this.isNew) {
        this.meta.createAt = this.meta.updateAt = moment_1.default();
    }
    else {
        this.meta.updateAt = moment_1.default();
    }
    next();
});
goodSchema.pre('update', function (next) {
    this.update({}, { $set: { 'meta.updateAt': moment_1.default() } });
    next();
});
exports.default = adminMongodb_1.connection.model('Good', goodSchema);
