"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose = require("mongoose");
var blog = require("../controllers/apis/blog");
var shop = require("../controllers/apis/shop");
var wx = require("../controllers/apis/wx");
var index_1 = require("../controllers/views/index");
mongoose.connect("mongodb://root:root@127.0.0.1:27017/wxShop?authSource=admin", {
    useNewUrlParser: true,
    useUnifiedTopology: true
});
mongoose.connection.on('error', function () {
    console.log('Mongoose connection error');
});
mongoose.connection.on('connected', function () {
    console.log('Mongoose connection success');
});
var rules = {
    '/': index_1.default('index'),
    '/boom': index_1.default('boom'),
    '/blogs': index_1.default('blogs'),
    '/admin': index_1.default('admin'),
    '/egret': index_1.default('egret')
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
    Object.keys(wx).map(function (key) {
        app.route("/api/" + key).all(wx[key]);
    });
});
