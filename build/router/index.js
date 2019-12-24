"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var blog = __importStar(require("../controllers/apis/blog"));
var shop = __importStar(require("../controllers/apis/shop"));
var wx = __importStar(require("../controllers/apis/wx"));
var test = __importStar(require("../controllers/apis/test"));
var index_1 = __importDefault(require("../controllers/views/index"));
var rules = {
    '/': index_1.default('index'),
    '/boom': index_1.default('boom'),
    '/blogs': index_1.default('blogs'),
    '/admin': index_1.default('admin'),
    '/egret': index_1.default('egret'),
    '/watchSys': index_1.default('admin')
};
exports.default = (function (app) {
    Object.keys(rules).map(function (key) {
        var ctrl = rules[key];
        app.use(key, ctrl.default || ctrl);
    });
    Object.keys(test).map(function (key) {
        app.route("/api/test/" + key).all(test[key]);
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
