"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose_1 = require("mongoose");
var moment = require("moment");
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
        this.meta.createAt = this.meta.updateAt = moment();
    }
    else {
        this.meta.updateAt = moment();
    }
    next();
});
exports.default = mongoose_1.model('Activite', activiteSchema);
