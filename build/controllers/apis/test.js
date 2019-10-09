"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mysql_1 = require("../../config/mysql");
exports.mysql = function (req, res) {
    mysql_1.connection.connect();
    mysql_1.connection.query('SELECT * FROM test', function (err, result) {
        if (err) {
            console.log('[SELECT ERROR] - ', err.message);
            return res.json({ code: 0, msg: err.message });
        }
        res.json({
            code: 0,
            data: result
        });
    });
    mysql_1.connection.end();
};
