"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express = require("express");
exports.default = (function (view) {
    var router = express.Router();
    router.get('/', function (req, res, next) {
        res.render(view, {
            fcdn: req.fcdn
        });
    });
    return router;
});
