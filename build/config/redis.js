"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var redis = __importStar(require("redis"));
var Flog = __importStar(require("../middleware/flog/index"));
var client = redis.createClient({
    host: 'hzz520.site',
    port: 6379,
    password: '1h2z3z2325076'
});
client.on('ready', function () {
    Flog.getLog('RREDIS').debug('redis connection success');
});
client.on('error', function () {
    Flog.getLog('RREDIS').debug('redis connection fail');
});
exports.default = client;
