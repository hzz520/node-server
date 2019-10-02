"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose = require("mongoose");
var AreasSchemas = new mongoose.Schema({
    _id: Number,
    code: Number,
    pcode: Number,
    name: String
});
var Areas = mongoose.model('Areas', AreasSchemas);
exports.default = Areas;
