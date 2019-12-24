"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var index_1 = __importDefault(require("../middleware/flog/index"));
exports.default = (function () { return function (err, connection) {
    return new Promise(function (resolve, reject) {
        if (err) {
            connection.release();
            index_1.default.getLog('MYSQL-FAIL').err(err.message);
            resolve(err);
        }
        else {
        }
    });
}; });
