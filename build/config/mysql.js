"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mysql = require("mysql");
exports.connectionPool = mysql.createPool({
    host: 'hzz.letin2586.com',
    user: 'root',
    password: '1h2z3z2325076',
    database: 'demo'
});
