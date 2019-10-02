"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose_1 = require("mongoose");
var moment = require("moment");
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
        this.meta.createAt = this.meta.updateAt = moment();
    }
    else {
        this.meta.updateAt = moment();
    }
    next();
});
goodSchema.pre('update', function (next) {
    this.update({}, { $set: { 'meta.updateAt': moment() } });
    next();
});
exports.default = mongoose_1.model('Good', goodSchema);
