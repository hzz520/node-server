"use strict";
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var path_1 = require("path");
var fs_1 = require("fs");
var mongoose_1 = require("mongoose");
var uuid_1 = require("uuid");
var multiparty_1 = require("multiparty");
var co_1 = require("co");
var md5_1 = require("md5");
var oss_1 = require("../config/oss");
var user_1 = require("../modules/shop/user");
var projects_1 = require("../modules/shop/projects");
var good_1 = require("../modules/shop/good");
var column_1 = require("../modules/shop/column");
var activity_1 = require("../modules/shop/activity");
exports.verify = function (req, res, next) {
    if (!(/(login|authenticate|uploadImg|removeImg|uploadImgs)/g.test(req.path))) {
        var _a = req.cookies, username = _a.username, password = _a.password, project_id_1 = _a.project_id;
        user_1.default.findOne({ username: username, password: password }, '-meta -__v -_id')
            .exec(function (err, response) {
            if (!err) {
                if (!response) {
                    return res.json({ code: 200, data: {} });
                }
                else {
                    if (project_id_1) {
                        projects_1.default.findOne({ project_id: "" + project_id_1 })
                            .exec(function (err, response) {
                            if (!err) {
                                if (!response) {
                                    return res.json({ code: 200, data: [] });
                                }
                            }
                        });
                    }
                }
            }
        });
    }
    next();
};
exports.login = function (req, res, next) {
    var _a = req.body, username = _a.username, password = _a.password;
    if (username == 'admin') {
        user_1.default.findOne({ username: username }, '-meta -__v -_id')
            .exec(function (err, response) {
            if (!err) {
                if (!response) {
                    if (password == 'admin') {
                        var user = new user_1.default({
                            _id: new mongoose_1.default.Types.ObjectId(),
                            username: username,
                            password: new Buffer(md5_1.default(password)).toString('base64')
                        });
                        user.save(function (err, response) {
                            if (!err) {
                                res.cookie('username', response.username, { maxAge: 24 * 3600 * 1000, path: '/' });
                                res.cookie('password', response.password, { maxAge: 24 * 3600 * 1000, path: '/' });
                                return res.json({
                                    code: 200,
                                    msg: '登录成功',
                                    data: {
                                        username: response.username,
                                        password: response.password,
                                        avatar: response.avatar,
                                        permission: response.permission,
                                        permisson_id: response.permission_id,
                                        role: response.role
                                    }
                                });
                            }
                        });
                    }
                    else
                        return res.json({ code: 200, msg: '密码错误', data: {} });
                }
                else {
                    if (response.password == new Buffer(md5_1.default(password)).toString('base64')) {
                        res.cookie('username', response.username, { maxAge: 24 * 3600 * 1000, path: '/' });
                        res.cookie('password', response.password, { maxAge: 24 * 3600 * 1000, path: '/' });
                        return res.json({
                            code: 200,
                            msg: '登录成功',
                            data: response
                        });
                    }
                    else {
                        return res.json({ code: 200, msg: '密码错误', data: {} });
                    }
                }
            }
        });
    }
    else {
        user_1.default.findOne({ username: username, password: new Buffer(md5_1.default(password)).toString('base64') }, '-meta -__v -_id -_id')
            .exec(function (err, response) {
            if (!err) {
                if (response) {
                    res.cookie('username', response.username, { maxAge: 24 * 3600 * 1000, path: '/' });
                    res.cookie('password', response.password, { maxAge: 24 * 3600 * 1000, path: '/' });
                    return res.json({ code: 200, data: response });
                }
                else {
                    return res.json({ code: 200, msg: '用户名或者密码错误', data: {} });
                }
            }
        });
    }
};
exports.authenticate = function (req, res, next) {
    var _a = req.cookies, username = _a.username, password = _a.password;
    user_1.default.findOne({ username: username, password: password }, '-meta -__v -_id')
        .exec(function (err, response) {
        if (!err) {
            if (response) {
                return res.json({ code: 200, ok: true, data: response });
            }
            else {
                return res.json({ code: 200, ok: false, data: {} });
            }
        }
    });
};
exports.permissionList = function (req, res, next) {
    user_1.default.find({}, '-meta -__v -_id -avatar')
        .exec(function (err, response) {
        if (!err) {
            return res.json({ code: 200, data: response || [] });
        }
    });
};
exports.projectList = function (req, res, next) {
    var project_id = req.body.project_id;
    var query = project_id ? { project_id: project_id } : {};
    projects_1.default.find(query, '-meta -__v -_id')
        .exec(function (err, response) {
        if (!err) {
            return res.json({ code: 200, data: project_id ? [response[0]] : response });
        }
    });
};
exports.projectEdit = function (req, res, next) {
    var form = new multiparty_1.default.Form({ uploadDir: path_1.default.resolve(__dirname, '../') });
    form.parse(req, function (err, fields, files) {
        var _a = JSON.parse(fields.data[0]), project_name = _a.project_name, project_id = _a.project_id, removeUrl = _a.removeUrl;
        if (Object.keys(files).length > 0) {
            files.files.map(function (file, i) {
                var key = "wxshop/" + uuid_1.default.v1() + ".png";
                var localFile = file.path;
                co_1.default(function () {
                    var result;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4, oss_1.default.delete(removeUrl.slice(removeUrl.indexOf('.com/') + 5))];
                            case 1:
                                result = _a.sent();
                                return [2];
                        }
                    });
                });
                co_1.default(function () {
                    var result, imgSrc;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4, oss_1.default.put(key, localFile)];
                            case 1:
                                result = _a.sent();
                                imgSrc = 'http://egret.oss-cn-beijing.aliyuncs.com/' + result.name;
                                fs_1.default.unlinkSync(localFile);
                                projects_1.default.findOne({ project_id: project_id.toString() })
                                    .exec(function (err, response) {
                                    if (response) {
                                        response.project_name = project_name;
                                        response.project_cover = imgSrc;
                                        response.save(function (err) {
                                            if (!err) {
                                                res.json({
                                                    code: 200,
                                                    msg: '项目配置修改成功',
                                                    data: [response]
                                                });
                                            }
                                        });
                                    }
                                    else {
                                        res.json({
                                            code: 200,
                                            msg: '未知错误',
                                            data: {}
                                        });
                                    }
                                });
                                return [2];
                        }
                    });
                }).catch(function (err) {
                    fs_1.default.unlinkSync(localFile);
                    res.code({ code: 500, msg: '上传图片失败', data: {} });
                });
            });
        }
        else {
            projects_1.default.findOne({ project_id: project_id.toString() })
                .exec(function (err, response) {
                if (response) {
                    response.project_name = project_name;
                    response.save(function (err) {
                        if (!err) {
                            res.json({
                                code: 200,
                                msg: '项目配置修改成功',
                                data: [response]
                            });
                        }
                    });
                }
                else {
                    res.json({
                        code: 200,
                        msg: '未知错误',
                        data: {}
                    });
                }
            });
        }
    });
};
exports.getGoodsList = function (req, res, next) {
    var _a = req.body, current = _a.current, pageSize = _a.pageSize, good_status = _a.good_status, good_name = _a.good_name, good_column_id = _a.good_column_id;
    var query;
    good_status = good_status === undefined || good_status === '' ? ['1', '2'] : [good_status];
    if (good_name === undefined && good_column_id === undefined || good_name === '' && good_column_id === '') {
        query = {
            good_status: { $in: good_status }
        };
    }
    else if (good_name === '') {
        query = {
            good_status: { $in: good_status },
            good_column_ids: good_column_id
        };
    }
    else if (good_column_id === '') {
        var reg = new RegExp(good_name, 'i');
        query = {
            good_name: { $regex: reg },
            good_status: { $in: good_status },
        };
    }
    else {
        var reg = new RegExp(good_name, 'i');
        query = {
            good_name: { $regex: reg },
            good_status: { $in: good_status },
            good_column_ids: good_column_id
        };
    }
    good_1.default.count(query, function (err, count) {
        if (!err) {
            pageSize === -1 ?
                good_1.default.find(query)
                    .sort({ _id: -1 })
                    .select('-meta -__v -_id')
                    .populate({
                    path: 'good_activite_ids',
                    options: {
                        select: 'activite_name'
                    }
                })
                    .exec(function (err, response) {
                    if (!err) {
                        return res.json({ code: 200, data: { total: count, current: current || 1, data: response } });
                    }
                })
                : good_1.default.find(query)
                    .populate([{
                        path: 'good_activite_ids',
                        options: {
                            select: 'activite_name'
                        }
                    }, {
                        path: 'good_column_ids',
                        options: {
                            select: 'column_name'
                        }
                    }])
                    .skip(((current || 1) - 1) * (pageSize || 10))
                    .limit(pageSize || 10)
                    .sort({ '_id': -1 })
                    .select('-meta -__v -_id')
                    .exec(function (err, response) {
                    if (!err) {
                        return res.json({ code: 200, data: { total: count, current: current || 1, data: response } });
                    }
                });
        }
    });
};
exports.getGoodData = function (req, res, next) {
    var good_id = req.body.good_id;
    good_1.default.findOne({ good_id: mongoose_1.default.Types.ObjectId(good_id) }, '-meta -_id -__v')
        .populate([{
            path: 'good_activite_ids',
            options: {
                select: 'activite_name'
            }
        }, {
            path: 'good_column_ids',
            options: {
                select: 'column_name'
            }
        }])
        .exec(function (err, response) {
        if (!err) {
            res.json({ code: 200, data: response });
        }
    });
};
exports.addGood = function (req, res, next) {
    var form = new multiparty_1.default.Form({ uploadDir: path_1.default.resolve(__dirname, '../') });
    form.parse(req, function (err, fields, files) {
        var _a = JSON.parse(fields.data[0]), good_name = _a.good_name, good_activite_ids = _a.good_activite_ids, good_column_ids = _a.good_column_ids, good_desc = _a.good_desc, good_oprice = _a.good_oprice, good_sprice = _a.good_sprice, good_status = _a.good_status, good_dSaleCount = _a.good_dSaleCount;
        var imgsArr = [];
        var promise = [];
        var id = new mongoose_1.default.Types.ObjectId();
        var obj = {
            _id: id,
            good_id: id,
            good_name: good_name,
            good_activite_ids: good_activite_ids,
            good_column_ids: good_column_ids,
            good_desc: good_desc,
            good_dSaleCount: good_dSaleCount,
            good_oprice: good_oprice,
            good_sprice: good_sprice,
            good_status: good_status
        };
        if (Object.keys(files).length > 0) {
            files.files.map(function (file, i) {
                var key = "wxshop/" + uuid_1.default.v1() + ".png";
                var localFile = file.path;
                if (i === 0) {
                    promise[0] = new Promise(function (resolve, reject) {
                        co_1.default(function () {
                            var result, imgSrc;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4, oss_1.default.put(key, localFile)];
                                    case 1:
                                        result = _a.sent();
                                        imgSrc = 'http://egret.oss-cn-beijing.aliyuncs.com/' + result.name;
                                        imgsArr.push(imgSrc);
                                        fs_1.default.unlinkSync(localFile);
                                        resolve();
                                        return [2];
                                }
                            });
                        }).catch(function (err) {
                            reject(err);
                            res.json({
                                code: 500,
                                msg: '上传图片失败'
                            });
                        });
                        if (i === files.files.length - 1) {
                            promise[0].then(function () {
                                var good = new good_1.default(Object.assign({}, obj, {
                                    good_imgs: imgsArr
                                }));
                                good.save(function (err, response) {
                                    if (!err) {
                                        res.json({ code: 200, data: [] });
                                    }
                                });
                            });
                        }
                    });
                }
                else {
                    promise[i] = promise[i - 1].then(function (resolve, reject) {
                        return new Promise(function (resolve, reject) {
                            co_1.default(function () {
                                var result, imgSrc;
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0: return [4, oss_1.default.put(key, localFile)];
                                        case 1:
                                            result = _a.sent();
                                            imgSrc = 'http://egret.oss-cn-beijing.aliyuncs.com/' + result.name;
                                            imgsArr.push(imgSrc);
                                            fs_1.default.unlinkSync(localFile);
                                            resolve();
                                            return [2];
                                    }
                                });
                            }).catch(function (err) {
                                reject(res);
                            });
                        });
                    });
                    if (i === files.files.length - 1) {
                        promise[i].then(function () {
                            var good = new good_1.default(Object.assign({}, obj, {
                                good_imgs: imgsArr
                            }));
                            good.save(function (err, response) {
                                if (!err) {
                                    res.json({ code: 200, data: [] });
                                }
                            });
                        });
                    }
                }
            });
        }
        else {
            var good = new good_1.default(Object.assign({}, obj, {
                good_imgs: imgsArr
            }));
            good.save(function (err, response) {
                if (!err) {
                    res.json({ code: 200, data: [] });
                }
            });
        }
    });
};
exports.editGood = function (req, res, next) {
    var form = new multiparty_1.default.Form({ uploadDir: path_1.default.resolve(__dirname, '../') });
    form.parse(req, function (err, fields, files) {
        var _a = JSON.parse(fields.data[0]), current = _a.current, total = _a.total, pageSize = _a.pageSize, good_id = _a.good_id, good_name = _a.good_name, good_activite_ids = _a.good_activite_ids, good_column_ids = _a.good_column_ids, good_desc = _a.good_desc, good_oprice = _a.good_oprice, good_sprice = _a.good_sprice, good_status = _a.good_status, good_dSaleCount = _a.good_dSaleCount;
        var imgsArr = [];
        var promise = [];
        if (Object.keys(files).length > 0) {
            files.files.map(function (file, i) {
                var key = "wxshop/" + uuid_1.default.v1() + ".png";
                var localFile = file.path;
                if (i === 0) {
                    promise[0] = new Promise(function (resolve, reject) {
                        co_1.default(function () {
                            var result, imgSrc;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4, oss_1.default.put(key, localFile)];
                                    case 1:
                                        result = _a.sent();
                                        imgSrc = 'http://egret.oss-cn-beijing.aliyuncs.com/' + result.name;
                                        imgsArr.push(imgSrc);
                                        fs_1.default.unlinkSync(localFile);
                                        resolve();
                                        return [2];
                                }
                            });
                        }).catch(function (err) {
                            reject(err);
                            res.json({
                                code: 500,
                                msg: '上传图片失败'
                            });
                        });
                    });
                    if (i === files.files.length - 1) {
                        promise[0].then(function () {
                            good_1.default.findOne({ good_id: mongoose_1.default.Types.ObjectId(good_id) })
                                .exec(function (err, response) {
                                if (response) {
                                    response.good_name = good_name;
                                    response.good_activite_ids = good_activite_ids;
                                    response.good_column_ids = good_column_ids;
                                    response.good_desc = good_desc;
                                    response.good_dSaleCount = good_dSaleCount;
                                    response.good_imgs = response.good_imgs.concat(imgsArr);
                                    response.good_oprice = good_oprice;
                                    response.good_sprice = good_sprice;
                                    response.good_status = good_status;
                                    response.save(function (err) {
                                        if (!err) {
                                            res.json({ code: 200, msg: '修改成功' });
                                        }
                                    });
                                }
                            });
                        });
                    }
                }
                else {
                    promise[i] = promise[i - 1].then(function (resolve, reject) {
                        return new Promise(function (resolve, reject) {
                            co_1.default(function () {
                                var result, imgSrc;
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0: return [4, oss_1.default.put(key, localFile)];
                                        case 1:
                                            result = _a.sent();
                                            imgSrc = 'http://egret.oss-cn-beijing.aliyuncs.com/' + result.name;
                                            imgsArr.push(imgSrc);
                                            fs_1.default.unlinkSync(localFile);
                                            resolve();
                                            return [2];
                                    }
                                });
                            }).catch(function (err) {
                                reject(res);
                            });
                        });
                    });
                    if (i === files.files.length - 1) {
                        promise[0].then(function () {
                            good_1.default.findOne({ good_id: mongoose_1.default.Types.ObjectId(good_id) })
                                .exec(function (err, response) {
                                if (response) {
                                    response.good_name = good_name;
                                    response.good_activite_ids = good_activite_ids;
                                    response.good_column_ids = good_column_ids;
                                    response.good_desc = good_desc;
                                    response.good_dSaleCount = good_dSaleCount;
                                    response.good_imgs = response.good_imgs.concat(imgsArr);
                                    response.good_oprice = good_oprice;
                                    response.good_sprice = good_sprice;
                                    response.good_status = good_status;
                                    response.save(function (err) {
                                        if (!err) {
                                            res.json({ code: 200, msg: '修改成功' });
                                        }
                                    });
                                }
                            });
                        });
                    }
                }
            });
        }
        else {
            if (current) {
                good_1.default.findOne({ good_id: mongoose_1.default.Types.ObjectId(good_id) })
                    .exec(function (err, response) {
                    response.good_status = good_status;
                    response.save(function (err) {
                        if (!err) {
                            good_1.default.find({})
                                .populate([{
                                    path: 'good_activite_ids',
                                    options: {
                                        select: 'activite_name'
                                    }
                                }, {
                                    path: 'good_column_ids',
                                    options: {
                                        select: 'column_name'
                                    }
                                }])
                                .skip(((current || 1) - 1) * (pageSize || 10))
                                .limit(pageSize || 10)
                                .sort({ '_id': -1 })
                                .select('-meta -__v -_id')
                                .exec(function (err, response) {
                                if (!err) {
                                    return res.json({ code: 200, data: { total: total, current: current || 1, data: response } });
                                }
                            });
                        }
                    });
                });
            }
            else {
                good_1.default.findOne({ good_id: mongoose_1.default.Types.ObjectId(good_id) })
                    .exec(function (err, response) {
                    response.good_name = good_name;
                    response.good_activite_ids = good_activite_ids;
                    response.good_column_ids = good_column_ids;
                    response.good_desc = good_desc;
                    response.good_dSaleCount = good_dSaleCount;
                    response.good_oprice = good_oprice;
                    response.good_sprice = good_sprice;
                    response.good_status = good_status;
                    response.save(function (err) {
                        if (!err) {
                            res.json({ code: 200, msg: '修改成功' });
                        }
                    });
                });
            }
        }
    });
};
exports.editGoodsStatus = function (req, res, next) {
    var _a = req.body, good_ids = _a.good_ids, current = _a.current, total = _a.total, pageSize = _a.pageSize, type = _a.type, good_status = _a.good_status;
    good_status = good_status ? good_status : ['1', '2'];
    good_1.default.update({ _id: {
            $in: good_ids.map(function (d, i) {
                return mongoose_1.default.Types.ObjectId(d);
            })
        } }, {
        $set: {
            good_status: type
        }
    }, { multi: true }, function (err, response) {
        if (!err) {
            good_1.default.find({
                good_status: { $in: good_status }
            })
                .populate([{
                    path: 'good_activite_ids',
                    options: {
                        select: 'activite_name'
                    }
                }, {
                    path: 'good_column_ids',
                    options: {
                        select: 'column_name'
                    }
                }])
                .skip(((current || 1) - 1) * (pageSize || 10))
                .limit(pageSize || 10)
                .sort({ '_id': -1 })
                .select('-meta -__v -_id')
                .exec(function (err, response) {
                if (!err) {
                    return res.json({ code: 200, msg: type === '2' ? '商品下架成功' : '商品重新上架成功', data: { total: total, current: current || 1, data: response } });
                }
            });
        }
    });
};
exports.removeGoods = function (req, res, next) {
    var _a = req.body, good_ids = _a.good_ids, current = _a.current, total = _a.total, pageSize = _a.pageSize, good_status = _a.good_status;
    good_status = good_status ? good_status : ['1', '2'];
    good_1.default.find({
        _id: {
            $in: good_ids.map(function (d, i) {
                return mongoose_1.default.Types.ObjectId(d);
            })
        },
        good_status: { $in: good_status }
    }).exec(function (err, response) {
        if (!err) {
            var imgsArr_1 = [];
            response.map(function (d, i) {
                imgsArr_1 = imgsArr_1.concat(d.good_imgs);
            });
            imgsArr_1.map(function (d, i) {
                co_1.default(function () {
                    var result;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4, oss_1.default.delete(d.slice(d.indexOf('.com/') + 5))];
                            case 1:
                                result = _a.sent();
                                return [2];
                        }
                    });
                });
            });
            good_1.default.remove({ _id: {
                    $in: good_ids.map(function (d, i) {
                        return mongoose_1.default.Types.ObjectId(d);
                    })
                } }, function (err) {
                if (!err) {
                    var temp_1 = total - good_ids.length;
                    var page = Math.ceil(temp_1 / (pageSize || 10));
                    current && current > page ? current = page : null;
                    good_1.default.find({})
                        .populate([{
                            path: 'good_activite_ids',
                            options: {
                                select: 'activite_name'
                            }
                        }, {
                            path: 'good_column_ids',
                            options: {
                                select: 'column_name'
                            }
                        }])
                        .skip(((current || 1) - 1) * (pageSize || 10))
                        .limit(pageSize || 10)
                        .sort({ '_id': -1 })
                        .select('-meta -__v -_id')
                        .exec(function (err, response) {
                        if (!err) {
                            return res.json({ code: 200, msg: '删除商品成功', data: { total: temp_1, current: current || 1, data: response } });
                        }
                    });
                }
            });
        }
    });
};
exports.getColumnList = function (req, res, next) {
    var _a = req.body, current = _a.current, pageSize = _a.pageSize;
    column_1.default.count({}, function (err, count) {
        if (!err) {
            pageSize !== -1 ?
                column_1.default.find({}, '-meta -__v -_id')
                    .skip(((current || 1) - 1) * (pageSize || 10))
                    .limit(pageSize || 10)
                    .sort({ 'column_id': -1 })
                    .exec(function (err, response) {
                    if (!err) {
                        return res.json({ code: 200, data: { total: count, current: current, data: response } });
                    }
                })
                : column_1.default.find({}, '-meta -__v -_id')
                    .sort({ 'column_id': -1 })
                    .exec(function (err, response) {
                    if (!err) {
                        return res.json({ code: 200, data: { total: count, current: current, data: response } });
                    }
                });
        }
    });
};
exports.addColumn = function (req, res, next) {
    var _a = req.body, total = _a.total, current = _a.current, pageSize = _a.pageSize, column_name = _a.column_name, column_desc = _a.column_desc;
    var id = new mongoose_1.default.Types.ObjectId();
    var column = new column_1.default({
        _id: id,
        column_id: id,
        column_name: column_name,
        column_desc: column_desc
    });
    column.save(function (err, response) {
        if (!err) {
            column_1.default.find({}, '-_id -__v -meta')
                .limit(pageSize || 10)
                .skip(((current || 1) - 1) * (pageSize || 10))
                .sort({ 'column_id': -1 })
                .exec(function (err, response) {
                if (!err) {
                    return res.json({ code: 200, msg: '添加成功', data: { total: total + 1, current: current || 1, data: response } });
                }
            });
        }
    });
};
exports.editColumn = function (req, res, next) {
    var _a = req.body, total = _a.total, current = _a.current, pageSize = _a.pageSize, column_id = _a.column_id, column_name = _a.column_name, column_desc = _a.column_desc;
    column_1.default.findOne({ column_id: mongoose_1.default.Types.ObjectId(column_id) })
        .exec(function (err, response) {
        if (!err && response) {
            response.column_name = column_name;
            response.column_desc = column_desc;
            response.save(function (err, response) {
                if (!err) {
                    column_1.default.find({}, '-_id -__v -meta')
                        .limit(pageSize || 10)
                        .skip(((current || 1) - 1) * (pageSize || 10))
                        .sort({ 'column_id': -1 })
                        .exec(function (err, response) {
                        if (!err) {
                            return res.json({ code: 200, msg: '修改成功', data: { total: total, current: current || 1, data: response } });
                        }
                    });
                }
            });
        }
    });
};
exports.removeColumn = function (req, res, next) {
    var _a = req.body, total = _a.total, current = _a.current, pageSize = _a.pageSize, column_id = _a.column_id;
    column_1.default.findOneAndRemove({ column_id: mongoose_1.default.Types.ObjectId(column_id) }, function (err, response) {
        if (!err) {
            column_1.default.find({}, '-_id, -meta, -__v')
                .limit(pageSize || 10)
                .skip(((current || 1) - 1) * (pageSize || 10))
                .sort({ 'column_id': -1 })
                .exec(function (err, response) {
                if (!err) {
                    return res.json({ code: 200, msg: '删除成功', data: { total: total - 1, current: current || 1, data: response } });
                }
            });
        }
    });
};
exports.getActiviteList = function (req, res, next) {
    var _a = req.body, current = _a.current, pageSize = _a.pageSize;
    activity_1.default.count({}, function (err, count) {
        if (!err) {
            pageSize !== -1 ?
                activity_1.default.find({}, '-meta -__v -_id')
                    .skip(((current || 1) - 1) * (pageSize || 10))
                    .limit(pageSize || 10)
                    .sort({ 'activite_id': -1 })
                    .exec(function (err, response) {
                    if (!err) {
                        return res.json({ code: 200, data: { total: count, current: current, data: response } });
                    }
                })
                : activity_1.default.find({}, '-meta -__v -_id')
                    .sort({ 'activite_id': -1 })
                    .exec(function (err, response) {
                    if (!err) {
                        return res.json({ code: 200, data: { total: count, current: current, data: response } });
                    }
                });
        }
    });
};
exports.addActivite = function (req, res, next) {
    var _a = req.body, total = _a.total, current = _a.current, pageSize = _a.pageSize, activite_name = _a.activite_name, activite_desc = _a.activite_desc, activite_rank = _a.activite_rank;
    var id = new mongoose_1.default.Types.ObjectId();
    var activite = new activity_1.default({
        _id: id,
        activite_id: id,
        activite_name: activite_name,
        activite_rank: activite_rank,
        activite_desc: activite_desc
    });
    activite.save(function (err, response) {
        if (!err) {
            activity_1.default.find({}, '-_id -__v -meta')
                .limit(pageSize || 10)
                .skip(((current || 1) - 1) * (pageSize || 10))
                .sort({ 'activite_id': -1 })
                .exec(function (err, response) {
                if (!err) {
                    return res.json({ code: 200, msg: '添加成功', data: { total: total + 1, current: current || 1, data: response } });
                }
            });
        }
    });
};
exports.editActivite = function (req, res, next) {
    var _a = req.body, total = _a.total, current = _a.current, pageSize = _a.pageSize, activite_name = _a.activite_name, activite_desc = _a.activite_desc, activite_rank = _a.activite_rank, activite_id = _a.activite_id;
    activity_1.default.findOne({ activite_id: mongoose_1.default.Types.ObjectId(activite_id) })
        .exec(function (err, response) {
        if (!err) {
            response.activite_name = activite_name;
            response.activite_rank = activite_rank;
            response.activite_desc = activite_desc;
            response.save(function (err, response) {
                if (!err) {
                    activity_1.default.find({}, '-_id -__v -meta')
                        .limit(pageSize || 10)
                        .skip(((current || 1) - 1) * (pageSize || 10))
                        .sort({ 'activite_id': -1 })
                        .exec(function (err, response) {
                        if (!err) {
                            return res.json({ code: 200, msg: '修改成功', data: { total: total, current: current || 1, data: response } });
                        }
                    });
                }
            });
        }
    });
};
exports.removeActivite = function (req, res, next) {
    var _a = req.body, total = _a.total, current = _a.current, pageSize = _a.pageSize, activite_id = _a.activite_id;
    activity_1.default.findOneAndRemove({ activite_id: mongoose_1.default.Types.ObjectId(activite_id) }, function (err, response) {
        if (!err) {
            activity_1.default.find({}, '-_id, -meta, -__v')
                .limit(pageSize || 10)
                .skip(((current || 1) - 1) * (pageSize || 10))
                .sort({ 'activite_id': -1 })
                .exec(function (err, response) {
                if (!err) {
                    return res.json({ code: 200, msg: '删除成功', data: { total: total - 1, current: current || 1, data: response } });
                }
            });
        }
    });
};
exports.uploadImg = function (req, res, next) {
    var _a = req.body, good_id = _a.good_id, project_id = _a.project_id, url = _a.url;
    var form = new multiparty_1.default.Form({ uploadDir: path_1.default.resolve(__dirname, '../') });
    form.parse(req, function (err, fields, files) {
        if (Object.keys(files).length > 0) {
            var key = "wxshop/" + uuid_1.default.v1() + ".png";
            var localFile = files.file[0].path;
            co_1.default(function () {
                var result, imgSrc;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4, oss_1.default.put(key, localFile)];
                        case 1:
                            result = _a.sent();
                            imgSrc = 'http://egret.oss-cn-beijing.aliyuncs.com/' + result.name;
                            fs_1.default.unlinkSync(localFile);
                            if (good_id)
                                good_1.default.findOne({ good_id: mongoose_1.default.Types.ObjectId(good_id) })
                                    .exec(function (err, response) {
                                    if (response) {
                                        var imgsArr = response.good_imgs;
                                        imgsArr.push(imgSrc);
                                        response.good_imgs = imgsArr;
                                        response.save(function (err) {
                                            if (!err) {
                                                return res.json({ code: 200, data: imgSrc });
                                            }
                                        });
                                    }
                                });
                            else if (project_id)
                                projects_1.default.findOne({ project_id: mongoose_1.default.Types.ObjectId(project_id) })
                                    .exec(function (err, response) {
                                    if (response) {
                                        response.project_cover = imgSrc;
                                        response.save(function (err) {
                                            if (!err) {
                                                co_1.default(function () {
                                                    var result;
                                                    return __generator(this, function (_a) {
                                                        switch (_a.label) {
                                                            case 0: return [4, oss_1.default.delete(url.slice(url.indexOf('.com/') + 5))];
                                                            case 1:
                                                                result = _a.sent();
                                                                return [2, res.json({ code: 200, data: imgSrc })];
                                                        }
                                                    });
                                                });
                                            }
                                        });
                                    }
                                });
                            else
                                return [2, res.json({ code: 200, data: imgSrc })];
                            return [2];
                    }
                });
            }).catch(function (err) {
                fs_1.default.unlinkSync(localFile);
                res.code({ code: 500, msg: '上传图片失败' });
            });
        }
    });
};
exports.removeImg = function (req, res, next) {
    var _a = req.body, url = _a.url, good_id = _a.good_id, project_id = _a.project_id, newUrl = _a.newUrl;
    co_1.default(function () {
        var result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4, oss_1.default.delete(url.slice(url.indexOf('.com/') + 5))];
                case 1:
                    result = _a.sent();
                    if (good_id) {
                        good_1.default.findOne({ good_id: mongoose_1.default.Types.ObjectId(good_id) })
                            .exec(function (err, response) {
                            if (response) {
                                var imgsArr = response.good_imgs;
                                imgsArr.splice(imgsArr.indexOf(url), 1);
                                response.good_imgs = imgsArr;
                                response.save(function (err) {
                                    if (!err) {
                                        res.json({ code: 200, msg: '删除图片成功' });
                                    }
                                });
                            }
                        });
                    }
                    else if (project_id) {
                        projects_1.default.findOne({ project_id: mongoose_1.default.Types.ObjectId(project_id) })
                            .exec(function (err, response) {
                            if (response) {
                                response.project_cover = newUrl;
                                response.save(function (err) {
                                    if (!err) {
                                        return res.json({ code: 200, data: '' });
                                    }
                                });
                            }
                        });
                    }
                    else {
                        return [2, res.json({ code: 200, msg: '删除图片成功' })];
                    }
                    return [2];
            }
        });
    }).catch(function (err) {
        res.json({ code: 200, msg: '未删除图片' });
    });
};
