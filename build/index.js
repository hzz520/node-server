"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express = require("express");
var path = require("path");
var bodyParser = require("body-parser");
var cookie = require("cookie-parser");
var fcdn_1 = require("./middleware/fcdn");
var Flog = require("./middleware/flog/index");
var expressStaticGzip = require("express-static-gzip");
var index_1 = require("./router/index");
var app = express();
app.use(bodyParser.json({
    inflate: true,
    limit: 5242880
}));
app.use(fcdn_1.default);
app.use(Flog.express());
app.use(bodyParser.urlencoded({ extended: true }));
app.set('views', path.join(__dirname, '../views'));
var root = path.join(__dirname, '../views');
app.set('views', root);
app.set('view engine', 'vm');
var Engine = require('velocity').Engine;
app.engine('vm', function (tpl, context, fn) {
    try {
        var engine = new Engine({
            template: path.join(tpl),
            root: root
        });
        var str = engine.render(context)
            .replace(/((\s{0,})(\n))/g, function ($0, $1, $2, $3) {
            return $3;
        })
            .replace(/^\n/, '');
        fn(null, str);
    }
    catch (error) {
        fn(error, '');
    }
});
app.use('/', expressStaticGzip(path.resolve(process.env.NODE_ENV === 'development' ? '/Aliyun' : '/opt', './egret/bin-release/web/2018')));
app.use(cookie());
index_1.default(app);
app.listen('8001', function () {
    Flog.getLog('STARTSERVER').debug('app is listenning http://localhost:8001');
});
