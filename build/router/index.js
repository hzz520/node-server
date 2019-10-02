"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose = require("mongoose");
var blog = require("../controllers/apis/blog");
var shop = require("../controllers/apis/shop");
mongoose.connect("mongodb://47.94.193.216:27017/wxShop", {
    useNewUrlParser: true,
    useUnifiedTopology: true
});
var rules = {
    '/blogs': require('../controllers/views/blog'),
    '/admin': require('../controllers/views/admin')
};
exports.default = (function (app) {
    Object.keys(blog).map(function (key) {
        app.route("/api/blog/" + key).all(blog[key]);
    });
    Object.keys(shop).map(function (key) {
        app.route("/api/chat/" + key).all(shop[key]);
    });
    Object.keys(rules).map(function (key) {
        var ctrl = rules[key];
        app.use(key, ctrl.default || ctrl);
    });
});
