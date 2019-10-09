"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mysql_1 = require("../../config/mysql");
var Flog = require("../../middleware/flog/index");
exports.mysql = function (req, res) {
    mysql_1.connectionPool.getConnection(function (err, connection) {
        if (err) {
            connection.release();
            Flog.getLog('MYSQL-FAIL').err(err.message);
            res.json({ code: -1, msg: err });
        }
        else {
            connection.query('SELECT * FROM test', function (err, result) {
                if (err) {
                    connection.release();
                    Flog.getLog('MYSQL-FAIL').err(err.message);
                    return res.json({ code: 0, msg: err.message });
                }
                connection.release();
                res.json({
                    code: 0,
                    data: result
                });
            });
        }
    });
};
