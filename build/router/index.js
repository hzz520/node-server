"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose = require("mongoose");
var blog = require("../controllers/apis/blog");
var shop = require("../controllers/apis/shop");
var index_1 = require("../controllers/views/index");
mongoose.connect("mongodb://47.94.193.216:27017/wxShop", {
    useNewUrlParser: true,
    useUnifiedTopology: true
});
var rules = {
    '/': index_1.default('index'),
    '/boom': index_1.default('boom'),
    '/blogs': index_1.default('blogs'),
    '/admin': index_1.default('admin')
};
exports.default = (function (app) {
    Object.keys(rules).map(function (key) {
        var ctrl = rules[key];
        app.use(key, ctrl.default || ctrl);
    });
    Object.keys(blog).map(function (key) {
        app.route("/api/blog/" + key).all(blog[key]);
    });
    Object.keys(shop).map(function (key) {
        app.route("/api/chat/" + key).all(shop[key]);
    });
});
