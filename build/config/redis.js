"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var redis = require("redis");
var Flog = require("../middleware/flog/index");
var client = redis.createClient({
    host: 'hzz.letin2586.com',
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
