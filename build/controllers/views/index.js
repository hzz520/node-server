"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
exports.default = (function (view, reg) {
    if (reg === void 0) { reg = '/'; }
    var router = express_1.Router();
    router.get(reg, function (req, res, next) {
        res.render(view, {
            fcdn: req.fcdn
        });
    });
    return router;
});
