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
exports.connection = void 0;
var mongoose_1 = __importDefault(require("mongoose"));
var Flog = __importStar(require("../middleware/flog/index"));
exports.connection = mongoose_1.default.createConnection("mongodb://hzz520.site:27017", {
    user: 'aliyun',
    pass: '1h2z3z2325076',
    dbName: 'shop',
    authSource: 'admin',
    useNewUrlParser: true,
    useUnifiedTopology: true
});
exports.connection.on('error', function () {
    Flog.getLog('MONGDB').err('mongoose connection blogs error');
});
exports.connection.on('connected', function () {
    Flog.getLog('MONGDB').debug('mongoose connection blogs success');
});
