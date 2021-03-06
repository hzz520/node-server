"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
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
    '/demo': index_1.default('demo'),
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
