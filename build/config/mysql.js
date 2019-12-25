"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var mysql_1 = __importDefault(require("mysql"));
exports.connectionPool = mysql_1.default.createPool({
    host: 'hzz520.site',
    user: 'root',
    password: '1h2z3z2325076',
    database: 'demo'
});
