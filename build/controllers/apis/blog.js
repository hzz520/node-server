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
var path = require("path");
var fs = require("fs");
var mongoose = require("mongoose");
var uuid = require("uuid");
var moment = require("moment");
var multiparty = require("multiparty");
var co = require("co");
var oss_1 = require("../../config/oss");
var articleList_1 = require("../../modules/blog/articleList");
var comments_1 = require("../../modules/blog/comments");
var replyByOters_1 = require("../../modules/blog/replyByOters");
var users_1 = require("../../modules/blog/users");
exports.articleList = function (req, res, next) {
    if (req.body._id) {
        var _a = req.body, _id_1 = _a._id, page = _a.page, limitNum = _a.limitNum;
        var limitNums_1 = limitNum || 5;
        var id_1 = mongoose.Types.ObjectId(_id_1);
        var skip_1 = limitNums_1 * (page - 1);
        var count_1 = 0;
        articleList_1.default.findOne({
            _id: id_1
        })
            .exec(function (err, response) {
            if (response == null)
                res.json({ code: 1, message: 'id不存在' });
            else {
                count_1 = response.comments.length;
                articleList_1.default.updateOne({ _id: _id_1 }, { $inc: { pv: 1 } }, function (err, response1) {
                    articleList_1.default.findOne({
                        _id: id_1
                    })
                        .populate({
                        path: 'comments',
                        populate: [
                            {
                                path: 'reply.avatar',
                                options: {
                                    select: 'avatar _id'
                                }
                            },
                            {
                                path: 'replyByOther',
                                populate: {
                                    path: 'avatar',
                                    options: {
                                        select: 'avatar _id'
                                    }
                                }
                            }
                        ],
                        options: {
                            sort: {
                                _id: -1
                            },
                            skip: skip_1,
                            limit: 5
                        }
                    })
                        .exec(function (err, response3) {
                        res.json({ code: 0, data: { article: response3, count: count_1, pageNum: Math.ceil(count_1 / limitNums_1) } });
                    });
                });
            }
        });
    }
    else if (!req.body.userId) {
        var limitNum_1 = req.body.limitNum;
        var skip_2 = (req.body.page - 1) * limitNum_1;
        var count = 0;
        if (req.body.type != 'serch') {
            var condition_1 = req.body.type == 'category' ? { category: req.body.category } : {};
            articleList_1.default.count(condition_1, function (err, count) {
                count = count;
                articleList_1.default.find(condition_1, '-comments').sort({ _id: -1 }).skip(skip_2).limit(limitNum_1).exec(function (err, response) {
                    res.json({ code: 0, data: { articleList: response, count: count, pageNum: Math.ceil(count / limitNum_1) } });
                });
            });
        }
        else {
            var keyword = req.body.keyword;
            var reg = new RegExp(keyword, 'i');
            var condition_2 = {
                $or: [
                    { title: { $regex: reg } },
                    { name: { $regex: reg } },
                    { content: { $regex: reg } }
                ]
            };
            articleList_1.default.count(condition_2, function (err, count) {
                count = count;
                articleList_1.default.find(condition_2, '-comments').sort({ _id: -1 }).skip(skip_2).limit(limitNum_1).exec(function (err, response) {
                    res.json({ code: 0, data: { articleList: response, count: count, pageNum: Math.ceil(count / limitNum_1) } });
                });
            });
        }
    }
    else {
        var limitNum_2 = req.body.limitNum;
        var skip = (req.body.page - 1) * limitNum_2;
        var count_2 = 0;
        var match = void 0;
        if (req.body.category == '1') {
            match = { category: '1' };
        }
        else if (req.body.category == '2') {
            match = { category: '2' };
        }
        else {
            match = {};
        }
        users_1.default.findOne({ _id: mongoose.Types.ObjectId(req.body.userId) })
            .populate({
            path: 'articles',
            match: match,
            options: {
                select: '-comments',
                sort: { _id: -1 },
                skip: skip,
                limit: limitNum_2 || 5
            }
        })
            .exec(function (err, response) {
            if (!err) {
                if (response) {
                    count_2 = response.articles.length;
                    res.json({ code: 0, message: '成功', data: { articleList: response.articles, count: count_2, pageNum: Math.ceil(count_2 / limitNum_2) } });
                }
                else {
                    res.json({ code: 1, message: '用户不存在' });
                }
            }
        });
    }
};
exports.publish = function (req, res, next) {
    var form = new multiparty.Form({ uploadDir: path.resolve(__dirname, '../') });
    form.parse(req, function (err, fields, files) {
        var _a = JSON.parse(fields.data[0]), name = _a.name, title = _a.title, content = _a.content, category = _a.category, pv = _a.pv, _id = _a._id;
        var cover = JSON.stringify(files, null, 2);
        users_1.default.findOne({ name: name }).exec(function (err, response) {
            if (!err && response) {
                if (Object.keys(files).length > 0) {
                    var key_1 = uuid.v1();
                    var localFile_1 = files.cover[0].path;
                    co(function () {
                        var result, imgSrc, article;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4, oss_1.default.put(key_1, localFile_1)];
                                case 1:
                                    result = _a.sent();
                                    imgSrc = '//egret.oss-cn-beijing.aliyuncs.com/' + result.name;
                                    article = new articleList_1.default({
                                        _id: new mongoose.Types.ObjectId(),
                                        name: name,
                                        title: title,
                                        content: content,
                                        category: category,
                                        cover: imgSrc
                                    });
                                    article.save(function (err, articlelists) {
                                        if (!err) {
                                            response.articles.push(article._id);
                                            response.save(function (err, response1) {
                                                fs.unlinkSync(localFile_1);
                                                res.json({ code: 0, message: '发布成功' });
                                            });
                                        }
                                    });
                                    return [2];
                            }
                        });
                    }).catch(function (err) {
                        fs.unlinkSync(localFile_1);
                        res.send({ code: 1, message: '上传图片失败', error: JSON.stringify(err) });
                    });
                }
                else {
                    var article_1 = new articleList_1.default({
                        _id: new mongoose.Types.ObjectId(),
                        name: name,
                        title: title,
                        content: content,
                        category: category
                    });
                    article_1.save(function (err, articlelists) {
                        if (!err) {
                            response.articles.push(article_1._id);
                            response.save(function (err, response1) {
                                res.json({ code: 0, message: '发布成功' });
                            });
                        }
                    });
                }
            }
            else {
                res.json({ code: 1, message: '用户名不存在' });
            }
        });
    });
};
exports.login = function (req, res, next) {
    var _a = req.body, name = _a.name, password = _a.password;
    users_1.default.find({ name: name }, function (err, response) {
        if (response.length == 0)
            res.json({ code: 1, message: '用户名不存在', data: {} });
        else {
            users_1.default.find({ name: name, password: password }, 'name avatar _id')
                .exec(function (err, response) {
                if (response.length == 0) {
                    res.json({ code: 1, message: '密码输入错误', data: {} });
                }
                else {
                    res.cookie('name', response[0].name, { maxAge: 3600 * 1000 });
                    res.json({ code: 0, message: '登录成功', data: response[0] });
                }
            });
        }
    });
};
exports.register = function (req, res, next) {
    var _a = req.body, name = _a.name, password = _a.password;
    users_1.default.find({ name: name })
        .exec(function (err, response) {
        if (response.length == 1) {
            res.json({ code: 1, message: '用户名已经存在' });
        }
        else {
            var user = new users_1.default({
                _id: new mongoose.Types.ObjectId(),
                name: name,
                password: password
            });
            user.save(function (err, users) {
                if (!err) {
                    res.json({ code: 0, message: '用户注册成功' });
                }
            });
        }
    });
};
exports.getUserInfo = function (req, res, next) {
    var name = req.cookies.name;
    users_1.default.find({ name: name }, 'name avatar _id')
        .exec(function (err, response) {
        if (!err) {
            if (response.length == 1) {
                res.json({ code: 0, data: response[0] });
            }
            else {
                res.json({ code: 1, data: {} });
            }
        }
    });
};
exports.updateUserInfo = function (req, res, next) {
    var _a = req.body, name = _a.name, avatar = _a.avatar, oldPassword = _a.oldPassword, newPassword = _a.newPassword, type = _a.type;
    if (avatar != '' && type == 'avatar') {
        users_1.default.findOne({ name: name }).exec(function (err, response) {
            if (response.avatar != "//egret.oss-cn-beijing.aliyuncs.com/i_4_2246533969x3386744293_21.jpg")
                co(function () {
                    var result;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4, oss_1.default.delete(response.avatar.slice(response.avatar.lastIndexOf('/') + 1))];
                            case 1:
                                result = _a.sent();
                                return [2];
                        }
                    });
                });
            var fileName = uuid.v1();
            var filePath = './' + fileName + '.png';
            var base64Data = avatar.replace(/^data:image\/[.|\w]+;base64,/, '');
            var bufferData = new Buffer(base64Data, 'base64');
            fs.writeFile(filePath, bufferData, function (err) {
                if (err) {
                    res.send({ status: '102', msg: '文件写入失败' });
                }
                else {
                    var localFile_2 = filePath;
                    var key_2 = fileName;
                    co(function () {
                        var result, imageSrc;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4, oss_1.default.put(key_2, localFile_2)];
                                case 1:
                                    result = _a.sent();
                                    imageSrc = '//egret.oss-cn-beijing.aliyuncs.com/' + result.name;
                                    fs.unlinkSync(filePath);
                                    response.avatar = imageSrc;
                                    response.save(function (err, response1) {
                                        res.json({ code: 0, message: '更新头像成功', data: {
                                                isLogin: true,
                                                info: {
                                                    name: response.name,
                                                    avatar: response.avatar,
                                                    _id: response._id
                                                }
                                            } });
                                    });
                                    return [2];
                            }
                        });
                    }).catch(function (err) {
                        fs.unlinkSync(filePath);
                        res.send({ code: 1, message: '更新头像失败' });
                    });
                }
            });
        });
    }
    else {
        users_1.default.findOne({ name: name, password: oldPassword })
            .exec(function (err, response) {
            if (!response) {
                res.json({ code: 1, message: '原始密码错误' });
            }
            response.password = newPassword;
            response.save(function (err, response1) {
                res.json({ code: 0, message: '更新密码成功', data: {
                        isLogin: true,
                        info: {
                            name: response.name,
                            avatar: response.avatar,
                            _id: response._id
                        }
                    } });
            });
        });
    }
};
exports.loginOut = function (req, res, next) {
    res.cookie('name', 'null', { maxAge: 0 });
    res.json({ code: 0, message: '退出登录成功' });
};
exports.comments = function (req, res, next) {
    var _a = req.body, _id = _a._id, message = _a.message, type = _a.type, answerBy = _a.answerBy, answerTo = _a.answerTo, limitNum = _a.limitNum, userId = _a.userId;
    var id = mongoose.Types.ObjectId(_id);
    if (type == 'article') {
        articleList_1.default.findOne({ _id: id })
            .exec(function (err, response) {
            if (response == undefined) {
                res.json({ code: 1, message: 'id不存在' });
            }
            else {
                var comment_1 = new comments_1.default({
                    _id: new mongoose.Types.ObjectId(),
                    reply: {
                        name: answerBy,
                        avatar: mongoose.Types.ObjectId(userId),
                        message: message,
                        time: moment().format('YYYY-MM-DD HH:mm')
                    }
                });
                comment_1.save(function (err) {
                    if (!err) {
                        response.comments.push(comment_1._id);
                        response.save(function (err) {
                            if (!err) {
                                articleList_1.default.findOne({ _id: id })
                                    .populate({
                                    path: 'comments',
                                    populate: {
                                        path: 'reply.avatar',
                                        options: {
                                            select: 'avatar _id'
                                        }
                                    },
                                    options: {
                                        sort: {
                                            _id: -1
                                        },
                                        limit: 1
                                    }
                                }).exec(function (err, response1) {
                                    res.json({
                                        code: 0,
                                        message: '留言成功',
                                        data: {
                                            comment: response1.comments[0],
                                            count: response.comments.length,
                                            pageNum: Math.ceil(response.comments.length / (limitNum || 5))
                                        }
                                    });
                                });
                            }
                            else
                                res.json({ code: 1, message: '留言失败' });
                        });
                    }
                    else {
                        res.json({ code: 1, message: '留言失败' });
                    }
                });
            }
        });
    }
    else {
        comments_1.default.findOne({ _id: id })
            .exec(function (err, response) {
            if (response == undefined)
                res.json({ code: 1, message: 'id不存在' });
            else {
                var replybyother_1 = new replyByOters_1.default({
                    _id: new mongoose.Types.ObjectId(),
                    answerBy: answerBy,
                    answerTo: answerTo,
                    avatar: mongoose.Types.ObjectId(userId),
                    message: message,
                    time: moment().format('YYYY-MM-DD HH:mm')
                });
                replybyother_1.save(function (err) {
                    if (!err) {
                        response.replyByOther.push(replybyother_1._id);
                        response.save(function (err) {
                            if (!err) {
                                comments_1.default.findOne({ _id: id })
                                    .populate({
                                    path: 'replyByOther',
                                    options: {
                                        sort: { _id: -1 },
                                        limit: 1
                                    },
                                    populate: {
                                        path: 'avatar',
                                        options: {
                                            select: 'avatar'
                                        }
                                    }
                                })
                                    .exec(function (err, response1) {
                                    res.json({ code: 0, message: '留言成功', data: response1.replyByOther[0] });
                                });
                            }
                            else
                                res.json({ code: 1, message: '留言失败' });
                        });
                    }
                    else
                        res.json({ code: 1, message: '留言失败' });
                });
            }
        });
    }
};
exports.commentspage = function (req, res, next) {
    var _a = req.body, page = _a.page, limitNum = _a.limitNum, _id = _a._id;
    var limitNums = limitNum || 5;
    var skip = limitNums * (page - 1);
    var id = mongoose.Types.ObjectId(_id);
    var pageNum = 0;
    var count = 0;
    articleList_1.default.findOne({ _id: id })
        .exec(function (err, response) {
        if (err)
            return;
        if (response == undefined) {
            res.json({ code: 1, message: '文章不存在' });
            return;
        }
        count = response.comments.length;
        articleList_1.default.findOne({ _id: id })
            .populate({
            path: 'comments',
            populate: [
                {
                    path: 'replyByOther',
                    populate: {
                        path: 'avatar',
                        options: {
                            select: 'avatar'
                        }
                    }
                },
                {
                    path: 'reply.avatar',
                    options: {
                        select: 'avatar'
                    }
                }
            ],
            options: {
                sort: { _id: -1 },
                skip: skip,
                limit: limitNum
            }
        })
            .exec(function (err, response) {
            res.json({ code: 0, message: '成功', data: {
                    comments: response.comments,
                    count: count,
                    pageNum: Math.ceil(count / limitNums)
                } });
        });
    });
};
exports.del = function (req, res, next) {
    var _a = req.body, articleId = _a.articleId, commentId = _a.commentId, subcommentId = _a.subcommentId, type = _a.type, key = _a.key;
    if (type == 'comment') {
        articleList_1.default.findOne({ _id: mongoose.Types.ObjectId(articleId) })
            .exec(function (err, response) {
            response.comments.splice(key, 1);
            response.save(function (err, response1) {
                comments_1.default.findOne({ _id: mongoose.Types.ObjectId(commentId) })
                    .exec(function (err, response2) {
                    if (response2.replyByOther.length > 0)
                        response2.replyByOther.forEach(function (el, i, arr) {
                            replyByOters_1.default.findOneAndRemove({ _id: mongoose.Types.ObjectId(el) }, function (err, response3) {
                            });
                        });
                    comments_1.default.findOneAndRemove({ _id: mongoose.Types.ObjectId(commentId) }, function (err, response4) {
                        res.json({ code: 0, message: '删除成功' });
                    });
                });
            });
        });
    }
    else {
        comments_1.default.findOne({ _id: mongoose.Types.ObjectId(commentId) })
            .exec(function (err, response) {
            if (response) {
                response.replyByOther.splice(key, 1);
                response.save(function (err, response) {
                    replyByOters_1.default.findOneAndRemove({ _id: mongoose.Types.ObjectId(subcommentId) }, function (err) {
                        if (!err) {
                            res.json({ code: 0, message: '删除成功', count: response.replyByOther.lenth });
                        }
                    });
                });
            }
            else {
                res.json({ code: 1, message: '删除失败' });
            }
        });
    }
};
exports.addOneComment = function (req, res, next) {
    var _a = req.body, page = _a.page, _id = _a._id, limitNum = _a.limitNum;
    articleList_1.default.findOne({ _id: mongoose.Types.ObjectId(_id) })
        .exec(function (err, response) {
        if (response) {
            var temp = response.comments[response.comments.length - page * (limitNum || 5)];
            comments_1.default.findOne({ _id: mongoose.Types.ObjectId(temp) })
                .populate('replyByOther')
                .exec(function (err, response) {
                if (response) {
                    res.json({ code: 0, message: '成功', data: { comment: response } });
                }
                else {
                    res.json({ code: 1, message: '失败' });
                }
            });
        }
        else {
            res.json({ code: 1, message: 'id不存在' });
        }
    });
};
exports.delArticle = function (req, res, next) {
    var _a = req.body, articleId = _a.articleId, limitNum = _a.limitNum, page = _a.page, type = _a.type, userId = _a.userId, index = _a.index;
    users_1.default.findOne({ _id: mongoose.Types.ObjectId(userId) })
        .exec(function (err, response) {
        response.articles.splice(response.articles.length - 1 - index, 1);
        response.save(function (err, response) {
            articleList_1.default.findOne({ _id: mongoose.Types.ObjectId(articleId) }).exec(function (err, response) {
                if (!err) {
                    if (response.cover != '' && response.cover != undefined) {
                        co(function () {
                            var result;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4, oss_1.default.delete(response.cover.slice(response.cover.lastIndexOf('/') + 1))];
                                    case 1:
                                        result = _a.sent();
                                        return [2];
                                }
                            });
                        }).catch(function (err) {
                        });
                    }
                    if (response.comments.length > 0) {
                        response.comments.forEach(function (el, index, arr) {
                            comments_1.default.findOneAndRemove({ _id: mongoose.Types.ObjectId(el) }, function (err, response) {
                                if (!err) {
                                    if (response.replyByOther.length > 0) {
                                        response.replyByOther.forEach(function (el, index, arr) {
                                            replyByOters_1.default.findOneAndRemove({ _id: mongoose.Types.ObjectId(el) }, function (err, response) {
                                            });
                                        });
                                    }
                                }
                            });
                        });
                    }
                    var match_1 = {};
                    if (req.body.category == '1') {
                        match_1 = { category: '1' };
                    }
                    else if (req.body.category == '2') {
                        match_1 = { category: '2' };
                    }
                    articleList_1.default.findOneAndRemove({ _id: mongoose.Types.ObjectId(articleId) }, function (err, response) {
                        users_1.default.findOne({ _id: mongoose.Types.ObjectId(userId) })
                            .populate({
                            path: 'ArticleList',
                            match: match_1,
                            options: {
                                sort: { _id: -1 }
                            }
                        })
                            .exec(function (err, response) {
                            var count = response.articles.length;
                            users_1.default.findOne({ _id: mongoose.Types.ObjectId(userId) })
                                .populate({
                                path: 'articles',
                                match: match_1,
                                options: {
                                    sort: { _id: -1 },
                                    select: '-comments',
                                    skip: (page - 1) * (limitNum || 5),
                                    limit: limitNum || 5
                                }
                            }).exec(function (err, response) {
                                res.json({ code: 0, message: '删除成功', data: {
                                        count: count,
                                        pageNum: Math.ceil(count / (limitNum || 5)),
                                        articleList: response.articles
                                    } });
                            });
                        });
                    });
                }
            });
        });
    });
};
exports.test = function (req, res, next) {
    res.json({ code: 0, msg: 111 });
};
