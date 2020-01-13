"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var netjet_1 = __importDefault(require("netjet"));
var path_1 = __importDefault(require("path"));
var body_parser_1 = __importDefault(require("body-parser"));
var cookie_parser_1 = __importDefault(require("cookie-parser"));
var index_1 = __importDefault(require("./middleware/flog/index"));
var serve_favicon_1 = __importDefault(require("serve-favicon"));
var fcdn_1 = __importDefault(require("./middleware/fcdn"));
var index_2 = __importDefault(require("./router/index"));
require("./config/redis");
var app = express_1.default();
app.use(body_parser_1.default.json({
    inflate: true,
    limit: 5242880
}));
app.use(serve_favicon_1.default(path_1.default.join(__dirname, '../static', 'favicon.ico')));
app.use(fcdn_1.default);
app.use(cookie_parser_1.default());
app.use(index_1.default.express());
app.use(body_parser_1.default.urlencoded({ extended: true }));
app.set('views', path_1.default.join(__dirname, '../views'));
var root = path_1.default.join(__dirname, '../views');
app.set('views', root);
app.set('view engine', 'vm');
var Engine = require('velocity').Engine;
app.engine('vm', function (tpl, context, fn) {
    try {
        var engine = new Engine({
            template: path_1.default.join(tpl),
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
app.use(netjet_1.default({
    cache: { max: 100 }
}));
index_2.default(app);
app.get('/jianli', function (req, res, next) {
    res.sendFile(path_1.default.resolve(__dirname, '../static/jianli/index.html'));
});
app.use('/static', express_1.default.static(path_1.default.resolve(__dirname, '../static')));
app.use('/', express_1.default.static(path_1.default.resolve(process.env.NODE_ENV === 'development' ? '/Aliyun' : '/opt', './egret/bin-release/web/2018')));
app.listen('8001', function () {
    index_1.default.getLog('STARTSERVER').debug('app is listenning http://localhost:8001');
    process.on('uncaughtException', function (err) {
        index_1.default.getLog('ERROR').err('err' + err);
        process.exit(1);
    });
    process.on('unhandledRejection', function (err) {
        index_1.default.getLog('ERROR').err('err1' + err);
    });
});
