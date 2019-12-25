"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose_1 = __importDefault(require("mongoose"));
var Flog = __importStar(require("../middleware/flog/index"));
exports.connection = mongoose_1.default.createConnection("mongodb://hzz520.site:27017", {
    user: 'aliyun',
    pass: '1h2z3z2325076',
    dbName: 'wxShop',
    authSource: 'admin',
    useNewUrlParser: true,
    useUnifiedTopology: true
});
exports.connection.on('error', function () {
    Flog.getLog('MONGDB').err('Mongoose connection admin error');
});
exports.connection.on('connected', function () {
    Flog.getLog('MONGDB').debug('Mongoose connection admin success');
});
