import * as path from 'path'
import * as fs from 'fs'
import * as mongoose from 'mongoose'
import * as uuid from 'uuid'
import * as multiparty from 'multiparty'
import * as co from 'co'
import * as md5 from 'md5'

import client from '../../config/oss'

import User, { shopUserDocument } from '../../modules/shop/user'
import Project, { shopProjectSchema } from '../../modules/shop/projects'
import Good, { shopGoodSchema } from '../../modules/shop/good'
import Column, { shopColumnSchema } from '../../modules/shop/column'
import Activite, { shopActiviteSchema } from '../../modules/shop/activity'

export const verify = (req,res,next) => {
    if(!(/(projectList|login|authenticate|uploadImg|removeImg|uploadImgs)/g.test(req.path))) {
        let { username, password, project_id } = req.cookies
        User.findOne({username:username,password:password},'-meta -__v -_id')
            .exec((err,response)=>{
                if(!err){   
                    if(!response){
                        return res.json({code:200,data: {}})
                    } else {
                        if(project_id){
                            Project.findOne({project_id:`${project_id}`})
                                .exec((err,response) => {
                                    if(!err){
                                        if(!response){
                                            res.json({code:200,data:[]})
                                        }
                                    } else {
                                        next()
                                    }
                                })
                        } else {
                            next()
                        }
                    }
                }
            })
    } else {
        next()
    }
}

// 登录
export const login = (req,res,next) => {
    let { username, password } = req.body
    if( username=='admin') {
        User.findOne({username:username},'-meta -__v -_id')
            .exec((err,response: shopUserDocument)=>{
        
                if(!err){
                    if(!response){
                        if(password=='admin'){
                            var user = new User({
                                _id:new mongoose.Types.ObjectId(),
                                username:username,
                                password:new Buffer(md5(password)).toString('base64')
                            })  
                            user.save((err,response: shopUserDocument)=>{
                                if(!err){
                                    res.cookie('username',response.username,{maxAge:24*3600*1000,path:'/'})
                                    res.cookie('password',response.password,{maxAge:24*3600*1000,path:'/'})
                                    return res.json({
                                        code:200,
                                        msg:'登录成功',
                                        data:{
                                            username:response.username,
                                            password:response.password,
                                            avatar:response.avatar,
                                            permission:response.permission,
                                            permisson_id:response.permission_id,
                                            role:response.role
                                        }
                                    })
                                }
                            })
                        } else
                            return res.json({code:200,msg:'密码错误',data:{}})
                        
                    } else {
                        if(response.password == new Buffer(md5(password)).toString('base64')){
                            res.cookie('username',response.username,{maxAge:24*3600*1000,path:'/'})
                            res.cookie('password',response.password,{maxAge:24*3600*1000,path:'/'})
                            return res.json({
                                code:200,
                                msg:'登录成功',
                                data:response
                            })
                        } else {
                            return res.json({code:200,msg:'密码错误',data:{}})
                        }
                    }
                }
            })
    } else {
         User.findOne({username:username,password:new Buffer(md5(password)).toString('base64')},'-meta -__v -_id -_id')
            .exec((err,response: shopUserDocument)=>{
                if(!err){
                    if(response){
                        res.cookie('username',response.username,{maxAge:24*3600*1000,path:'/'})
                        res.cookie('password',response.password,{maxAge:24*3600*1000,path:'/'})
                        return res.json({code:200,data:response})
                    } else {
                        return res.json({code:200,msg:'用户名或者密码错误',data:{}})
                    }
                }
            })
    }
}

// 获取用户信息
export const authenticate = (req,res,next) => {
    let { username, password } = req.cookies
    User.findOne({username:username,password:password},'-meta -__v -_id')
        .exec((err,response)=>{
            if(!err){   
                if(response){
                    return res.json({code:200,ok:true,data:response})
                } else {
                    return res.json({code:200,ok:false,data:{}})
                }
            }
        })
}

/**
 * 权限管理
 * 
 */
export const permissionList = (req,res,next) => {
    User.find({},'-meta -__v -_id -avatar')
        .exec((err,response)=>{
            if(!err) {  
                return res.json({code:200,data:response||[]})  
            }
        })
}

/**
 * 项目管理
 * 
 */
export const projectList = (req,res,next) => {
    let project_id = req.body.project_id || req.query.project_id
    console.log('projectList', project_id)
    let query = project_id ? {project_id:project_id} : {}
    Project.find(query,'-meta -__v -_id')
        .exec((err,response) => {
            if(!err) {
                res.json({code:200,data:project_id ? [response[0]] :response})
            }
        })
}

export const projectEdit = (req,res,next) => {
    var form = new multiparty.Form({uploadDir: path.resolve(__dirname,'../')})
    form.parse(req,function(err,fields,files){
        let { project_name, project_id, removeUrl } = JSON.parse(fields.data[0])
        if(Object.keys(files).length>0){
            files.files.map((file, i) => {
                var key = `wxshop/${uuid.v1()}.png`
                var localFile = file.path
                co(function* () {
                    var result = yield client.delete(removeUrl.slice(removeUrl.indexOf('.com/') + 5)) 
                })
                co(function* (){
                    var result = yield client.put(key, localFile)
                    let imgSrc = 'http://egret.oss-cn-beijing.aliyuncs.com/' + result.name
                    fs.unlinkSync(localFile)
                    Project.findOne({project_id:project_id.toString()})
                        .exec((err,response: shopProjectSchema) => {
                            if (response) {
                                response.project_name = project_name
                                response.project_cover = imgSrc
                                response.save((err) => {
                                    if (!err) {
                                        res.json({
                                            code:200,
                                            msg:'项目配置修改成功',
                                            data: [response]
                                        })
                                    }
                                })
                            } else {
                                res.json({
                                    code:200,
                                    msg:'未知错误',
                                    data: {}
                                })
                            }
                        })
                }).catch(function(err){
                    fs.unlinkSync(localFile)
                    res.code({code:500,msg:'上传图片失败',data:{}})
                })
            })
        } else {
            Project.findOne({project_id:project_id.toString()})
                .exec((err,response: shopProjectSchema) => {
                    if (response) {
                        response.project_name = project_name
                        response.save((err) => {
                            if (!err) {
                                res.json({
                                    code:200,
                                    msg:'项目配置修改成功',
                                    data: [response]
                                })
                            }
                        })
                    } else {
                        res.json({
                            code:200,
                            msg:'未知错误',
                            data: {}
                        })
                    }
                })
        }
    })
}

/**
 * 商品管理
 * 
 */

// 商品列表
export const getGoodsList = (req,res,next) => {
    let { current, pageSize, good_status, good_name, good_column_id} = req.body
    let query 
    good_status = good_status===undefined || good_status === '' ? ['1','2'] : [good_status]
    if (good_name === undefined && good_column_id === undefined || good_name === '' && good_column_id === '') {
        query = {
            good_status:{$in:good_status}
        }
    } else if (good_name === '') {
        query = {
           good_status:{$in:good_status},
           good_column_ids: good_column_id
        }
    } else if (good_column_id === '') {
        var reg = new RegExp(good_name,'i')
        query = {
            good_name: {$regex: reg}, 
             good_status:{$in:good_status},
        }
    } else {
        var reg = new RegExp(good_name,'i')
        query = {
            good_name: {$regex: reg}, 
            good_status:{$in:good_status},
            good_column_ids: good_column_id
        }
    }
    
    Good.count(query,
        (err,count)=>{
            if(!err) {
                pageSize === -1 ?
                Good.find(query)
                    .sort({_id:-1})
                    .select('-meta -__v -_id')
                    .populate({
                        path:'good_activite_ids',
                        options: {
                            select:'activite_name'
                        }
                    })
                    .exec((err,response)=>{
                        if(!err) {
                            return res.json({code:200,data:{total:count,current:current||1,data:response}})
                        }
                    })
                : Good.find(query)
                    .populate([{
                        path:'good_activite_ids',
                        options: {
                            select:'activite_name'
                        }
                    },{
                        path:'good_column_ids',
                        options: {
                            select:'column_name'
                        }
                    }])
                    .skip(((current || 1) - 1) * (pageSize||10))
                    .limit(pageSize||10)
                    .sort({'_id':-1})
                    .select('-meta -__v -_id')
                    .exec((err,response)=>{
                        if(!err) {
                            return res.json({code:200,data:{total:count,current:current||1,data:response}})
                        }
                    })
            }
    })
    
}

// 商品详情
export const getGoodData = (req,res,next) => {
    let {good_id} = req.body
    Good.findOne({good_id:mongoose.Types.ObjectId(good_id)},'-meta -_id -__v')
        .populate([{
            path:'good_activite_ids',
            options: {
                select:'activite_name'
            }
        },{
            path:'good_column_ids',
            options: {
                select:'column_name'
            }
        }])
        .exec((err,response) => {
            if(!err) {
                res.json({code:200,data:response})
            }
        })
}

// 添加商品
export const addGood = (req,res,next) => {
    var form = new multiparty.Form({uploadDir: path.resolve(__dirname,'../')})
    form.parse(req,function(err,fields,files){
        let { good_name, good_activite_ids, good_column_ids, good_desc, good_oprice, good_sprice, good_status, good_dSaleCount } = JSON.parse(fields.data[0])
        let imgsArr = []
        let promise = []
        let id = new mongoose.Types.ObjectId()
        let obj = {
            _id:id,
            good_id:id,
            good_name, 
            good_activite_ids, 
            good_column_ids, 
            good_desc, 
            good_dSaleCount,
            good_oprice, 
            good_sprice, 
            good_status 
        }
        if(Object.keys(files).length>0){
            files.files.map((file, i) => {
                var key = `wxshop/${uuid.v1()}.png`
                var localFile = file.path
                if (i === 0){
                    promise[0] = new Promise((resolve, reject) => {
                        co(function* () {
                            var result = yield client.put(key, localFile)
                            let imgSrc = 'http://egret.oss-cn-beijing.aliyuncs.com/' + result.name
                            imgsArr.push(imgSrc)
                            fs.unlinkSync(localFile)
                            resolve()
                        }).catch((err)=> {
                            reject(err)
                            res.json({
                                code: 500,
                                msg: '上传图片失败'
                            })
                        })
                        if (i === files.files.length - 1) {
                            promise[0].then(() => {
                                let good = new Good(Object.assign({},obj,{
                                    good_imgs:imgsArr
                                }))
                                good.save((err,response)=>{
                                    if(!err) {
                                        res.json({code:200,data:[]})
                                    }
                                })
                            })
                        }
                    })
                } else {
                    promise[i] = promise[i-1].then((resolve, reject) => {
                        return new Promise((resolve, reject) => {
                            co(function* () {
                                var result = yield client.put(key, localFile)
                                let imgSrc = 'http://egret.oss-cn-beijing.aliyuncs.com/' + result.name
                                imgsArr.push(imgSrc)
                                fs.unlinkSync(localFile)
                                resolve()
                            }).catch((err) => {
                                reject(res)
                            })
                        })
                    })
                    if (i === files.files.length - 1) {
                        promise[i].then(() => {
                            let good = new Good(Object.assign({},obj,{
                                good_imgs:imgsArr
                            }))
                            good.save((err,response)=>{
                                if(!err) {
                                    res.json({code:200,data:[]})
                                }
                            })
                        })
                    }
                }
            })
        } else {
            let good = new Good(Object.assign({},obj,{
                good_imgs:imgsArr
            }))
            good.save((err,response)=>{
                if(!err) {
                    res.json({code:200,data:[]})
                }
            })
        }
    })
}

// 编辑商品
export const editGood = (req,res,next) => {
    var form = new multiparty.Form({uploadDir: path.resolve(__dirname,'../')})
    form.parse(req,function(err,fields,files){
        let { current, total, pageSize, good_id ,good_name, good_activite_ids, good_column_ids, good_desc, good_oprice, good_sprice, good_status, good_dSaleCount } = JSON.parse(fields.data[0])
        let imgsArr = []
        let promise = []
        if(Object.keys(files).length>0){
            files.files.map((file, i) => {
                var key = `wxshop/${uuid.v1()}.png`
                var localFile = file.path
                if (i === 0){
                    promise[0] = new Promise((resolve, reject) => {
                        co(function* () {
                            var result = yield client.put(key, localFile)
                            let imgSrc = 'http://egret.oss-cn-beijing.aliyuncs.com/' + result.name
                            imgsArr.push(imgSrc)
                            fs.unlinkSync(localFile)
                            resolve()
                        }).catch((err)=> {
                            reject(err)
                            res.json({
                                code: 500,
                                msg: '上传图片失败'
                            })
                        })
                    })
                    if (i === files.files.length - 1) {
                        promise[0].then(() => {
                            Good.findOne({good_id:mongoose.Types.ObjectId(good_id)})
                                .exec((err, response: shopGoodSchema) => {
                                    if(response) {
                                        response.good_name = good_name
                                        response.good_activite_ids = good_activite_ids
                                        response.good_column_ids = good_column_ids
                                        response.good_desc = good_desc
                                        response.good_dSaleCount = good_dSaleCount
                                        response.good_imgs = response.good_imgs.concat(imgsArr)
                                        response.good_oprice = good_oprice
                                        response.good_sprice = good_sprice
                                        response.good_status = good_status
                                        response.save((err) => {
                                            if(!err) {
                                                res.json({code:200,msg:'修改成功'})
                                            }
                                        })
                                    
                                    }
                                })
                        })
                    } 
                } else {
                    promise[i] = promise[i-1].then((resolve, reject) => {
                        return new Promise((resolve, reject) => {
                            co(function* () {
                                var result = yield client.put(key, localFile)
                                let imgSrc = 'http://egret.oss-cn-beijing.aliyuncs.com/' + result.name
                                imgsArr.push(imgSrc)
                                fs.unlinkSync(localFile)
                                resolve()
                            }).catch((err) => {
                                reject(res)
                            })
                        })
                    })
                    if (i === files.files.length - 1) {
                        promise[0].then(() => {
                            Good.findOne({good_id:mongoose.Types.ObjectId(good_id)})
                                .exec((err, response: shopGoodSchema) => {
                                    if(response) {
                                        response.good_name = good_name
                                        response.good_activite_ids = good_activite_ids
                                        response.good_column_ids = good_column_ids
                                        response.good_desc = good_desc
                                        response.good_dSaleCount = good_dSaleCount
                                        response.good_imgs = response.good_imgs.concat(imgsArr)
                                        response.good_oprice = good_oprice
                                        response.good_sprice = good_sprice
                                        response.good_status = good_status
                                        response.save((err) => {
                                            if(!err) {
                                                res.json({code:200,msg:'修改成功'})
                                            }
                                        })
                                    
                                    }
                                })
                        })
                    }
                }
            })
        } else {
            if(current) {
                Good.findOne({good_id:mongoose.Types.ObjectId(good_id)})
                    .exec((err, response: shopGoodSchema) => {
                        response.good_status = good_status
                        response.save((err) => {
                            if(!err) {
                                Good.find({})
                                    .populate([{
                                        path:'good_activite_ids',
                                        options: {
                                            select:'activite_name'
                                        }
                                    },{
                                        path:'good_column_ids',
                                        options: {
                                            select:'column_name'
                                        }
                                    }])
                                    .skip(((current || 1) - 1) * (pageSize||10))
                                    .limit(pageSize||10)
                                    .sort({'_id':-1})
                                    .select('-meta -__v -_id')
                                    .exec((err,response)=>{
                                        if(!err) {
                                            return res.json({code:200,data:{total:total,current:current||1,data:response}})
                                        }
                                    })   
                            }
                        })
                    })
            } else {
                Good.findOne({good_id:mongoose.Types.ObjectId(good_id)})
                    .exec((err, response: shopGoodSchema) => {
                        response.good_name = good_name
                        response.good_activite_ids = good_activite_ids
                        response.good_column_ids = good_column_ids
                        response.good_desc = good_desc
                        response.good_dSaleCount = good_dSaleCount
                        response.good_oprice = good_oprice
                        response.good_sprice = good_sprice
                        response.good_status = good_status

                        response.save((err) => {
                            if(!err) {
                                res.json({code:200,msg:'修改成功'})
                            }
                        })
                    })
            }
        }
    })
}

// 商品状态改变
export const editGoodsStatus = (req,res,next) => {
    let {good_ids, current, total, pageSize, type, good_status} = req.body
    good_status = good_status ? good_status : ['1','2']
    Good.update({_id:
        {
            $in:good_ids.map((d, i) => {
                return mongoose.Types.ObjectId(d)
            })
        }},{
            $set:{
                good_status:type
            }
        },
        { multi: true },
        (err,response)=>{
            if(!err) {
                Good.find({
                    good_status:{$in:good_status}
                })
                    .populate([{
                        path:'good_activite_ids',
                        options: {
                            select:'activite_name'
                        }
                    },{
                        path:'good_column_ids',
                        options: {
                            select:'column_name'
                        }
                    }])
                    .skip(((current || 1) - 1) * (pageSize||10))
                    .limit(pageSize||10)
                    .sort({'_id':-1})
                    .select('-meta -__v -_id')
                    .exec((err,response)=>{
                        if(!err) {
                            return res.json({code:200,msg:type==='2' ? '商品下架成功' : '商品重新上架成功',data:{total:total,current:current||1,data:response}})
                        }
                    }) 
            }
        })
}

// 删除商品
export const removeGoods = (req,res,next) => {
    let {good_ids,current,total,pageSize,good_status} = req.body
    good_status = good_status ? good_status : ['1','2']
    Good.find(
        {
            _id:{
                $in:good_ids.map((d, i) => {
                    return mongoose.Types.ObjectId(d)
                })
            },
            good_status:{$in:good_status}
        }).exec((err, response: shopGoodSchema[])=>{
            if(!err) {
                let imgsArr = []
                response.map((d, i) => {
                    imgsArr = imgsArr.concat(d.good_imgs)
                })
                imgsArr.map((d, i) => {
                    co(function* (){
                        var result = yield client.delete(d.slice(d.indexOf('.com/') + 5))
                    })
                })
                Good.remove(
                    {_id:{
                        $in:good_ids.map((d, i) => {
                            return mongoose.Types.ObjectId(d)
                        })
                    }},(err)=>{
                        if(!err) {
                            let temp = total - good_ids.length
                            let page = Math.ceil(temp / (pageSize || 10))
                            current && current > page ? current = page : null
                            Good.find({})
                                .populate([{
                                    path:'good_activite_ids',
                                    options: {
                                        select:'activite_name'
                                    }
                                },{
                                    path:'good_column_ids',
                                    options: {
                                        select:'column_name'
                                    }
                                }])
                                .skip(((current || 1) - 1) * (pageSize||10))
                                .limit(pageSize||10)
                                .sort({'_id':-1})
                                .select('-meta -__v -_id')
                                .exec((err,response)=>{
                                    if(!err) {
                                        return res.json({code:200,msg:'删除商品成功',data:{total:temp,current:current||1,data:response}})
                                    }
                                }) 
                        }
                    })
            }
        })
}



/**
 * 专栏管理
 * 
 */

// 专栏列表
export const getColumnList = (req,res,next) => {
    let { current, pageSize } = req.body
    Column.count({},
        (err,count)=>{
            if(!err) {
                pageSize !== -1 ?
                Column.find({},'-meta -__v -_id')
                    .skip(((current || 1) - 1) * (pageSize||10))
                    .limit(pageSize||10)
                    .sort({'column_id':-1})
                    .exec((err,response)=>{
                        if(!err) {
                            return res.json({code:200,data:{total:count,current:current,data:response}})
                        }
                    })
                : Column.find({},'-meta -__v -_id')
                    .sort({'column_id':-1})
                    .exec((err,response)=>{
                        if(!err) {
                            return res.json({code:200,data:{total:count,current:current,data:response}})
                        }
                    })
            }
        })

}

// 添加专栏
export const addColumn = (req,res,next) => {
    let { total, current, pageSize, column_name, column_desc } = req.body
    let id = new mongoose.Types.ObjectId()
    let column = new Column({
        _id:id,
        column_id: id,
        column_name: column_name,
        column_desc: column_desc
    })
    column.save((err,response)=>{
        if(!err) {
            Column.find({},'-_id -__v -meta')
                .limit(pageSize||10)
                .skip(((current || 1) - 1) * (pageSize||10))
                .sort({'column_id':-1})
                .exec((err,response)=>{
                    if(!err) {
                        return res.json({code:200,msg:'添加成功',data:{total:total+1, current:current||1,data:response}})
                    }  
                })
        }
    })
}

// 修改专栏
export const editColumn = (req,res,next) => {
    let { total, current, pageSize, column_id ,column_name, column_desc } = req.body
    Column.findOne({column_id:mongoose.Types.ObjectId(column_id)})
        .exec((err,response: shopColumnSchema)=>{
            if(!err&&response) {
                // let newVal = Object.assign({}, response, {column_name,column_desc})
                response.column_name = column_name
                response.column_desc = column_desc
                response.save((err,response)=>{
                    if(!err) {
                        Column.find({},'-_id -__v -meta')
                            .limit(pageSize||10)
                            .skip(((current || 1) - 1) * (pageSize||10))
                            .sort({'column_id':-1})
                            .exec((err,response)=>{
                                if(!err) {
                                    return res.json({code:200,msg:'修改成功',data:{total:total, current:current||1 ,data:response}})
                                }  
                            })
                    }
                })
            }
        }) 
}

// 删除专栏
export const removeColumn = (req,res,next) => {
    let { total, current, pageSize, column_id } = req.body
    Column.findOneAndRemove({column_id:mongoose.Types.ObjectId(column_id)},(err,response)=>{
        if(!err) {
            Column.find({},'-_id, -meta, -__v')
                .limit(pageSize||10)
                .skip(((current || 1) - 1) * (pageSize||10))
                .sort({'column_id':-1})
                .exec((err,response)=>{
                    if(!err) {
                        return res.json({code:200,msg:'删除成功',data:{total:total-1, current:current||1 ,data:response}})
                    }  
                })
        }
    })
}

/**
 * 商品活动管理
 * 
 */

// 商品活动列表
export const getActiviteList = (req,res,next) => {
    let { current, pageSize } = req.body
    Activite.count({},
        (err, count) => {
            if(!err) {
                pageSize !== -1 ?
                Activite.find({},'-meta -__v -_id')
                    .skip(((current || 1) - 1) * (pageSize||10))
                    .limit(pageSize||10)
                    .sort({'activite_id':-1})
                    .exec((err,response)=>{
                        if(!err) {
                            return res.json({code:200,data:{total:count,current:current,data:response}})
                        }
                    })
                : Activite.find({},'-meta -__v -_id')
                    .sort({'activite_id':-1})
                    .exec((err,response)=>{
                        console.log(response)
                        if(!err) {
                            return res.json({code:200,data:{total:count,current:current,data:response}})
                        }
                    })
            }
        }
    )
}

// 添加商品活动
export const addActivite = (req,res,next) => {
    let { total, current, pageSize, activite_name, activite_desc, activite_rank } = req.body
    let id = new mongoose.Types.ObjectId()
    let activite = new Activite({
        _id: id,
        activite_id: id,
        activite_name: activite_name,
        activite_rank: activite_rank,
        activite_desc: activite_desc
    })
    activite.save((err,response)=>{
        if(!err) {
            Activite.find({},'-_id -__v -meta')
                .limit(pageSize||10)
                .skip(((current || 1) - 1) * (pageSize||10))
                .sort({'activite_id':-1})
                .exec((err,response)=>{
                    if(!err) {
                        return res.json({code:200,msg:'添加成功',data:{total:total+1, current:current||1,data:response}})
                    }  
                })
        }
    })
}

// 修改商品活动
export const editActivite = (req,res,next) => {
    let { total, current, pageSize, activite_name, activite_desc, activite_rank, activite_id } = req.body
    Activite.findOne({activite_id:mongoose.Types.ObjectId(activite_id)})
        .exec((err,response: shopActiviteSchema) => {
            if(!err) {
                response.activite_name = activite_name
                response.activite_rank = activite_rank
                response.activite_desc = activite_desc
                response.save((err,response)=>{
                    if(!err) {
                        Activite.find({},'-_id -__v -meta')
                            .limit(pageSize||10)
                            .skip(((current || 1) - 1) * (pageSize||10))
                            .sort({'activite_id':-1})
                            .exec((err,response)=>{
                                if(!err) {
                                    return res.json({code:200,msg:'修改成功',data:{total:total, current:current||1 ,data:response}})
                                }  
                            })
                    }
                })
            }
        })
}

// 删除商品活动
export const removeActivite = (req,res,next) => {
let { total, current, pageSize, activite_id } = req.body
    Activite.findOneAndRemove({activite_id:mongoose.Types.ObjectId(activite_id)},(err,response)=>{
        if(!err) {
            Activite.find({},'-_id, -meta, -__v')
                .limit(pageSize||10)
                .skip(((current || 1) - 1) * (pageSize||10))
                .sort({'activite_id':-1})
                .exec((err,response)=>{
                    if(!err) {
                        return res.json({code:200,msg:'删除成功',data:{total:total-1, current:current||1 ,data:response}})
                    }  
                })
        }
    })
}

/**
 *  图片处理
 * 
 */

// 上传图片
export const uploadImg = (req,res,next) => {
    let { good_id, project_id, url } = req.body
    var form = new multiparty.Form({uploadDir: path.resolve(__dirname,'../')})
    form.parse(req,function(err,fields,files){

        if(Object.keys(files).length>0){
            var key = `wxshop/${uuid.v1()}.png`
            var localFile = files.file[0].path

            co(function* (){
                var result = yield client.put(key, localFile)
                let imgSrc = 'http://egret.oss-cn-beijing.aliyuncs.com/' + result.name
                fs.unlinkSync(localFile)
                if (good_id)
                    Good.findOne({good_id:mongoose.Types.ObjectId(good_id)}) 
                        .exec((err,response: shopGoodSchema)=>{
                            if(response) {
                                let imgsArr = response.good_imgs
                                imgsArr.push(imgSrc)
                                response.good_imgs = imgsArr
                                response.save((err) => {
                                    if(!err) {
                                        return res.json({code:200,data:imgSrc})
                                    }
                                })
                            }
                        })
                else if (project_id)
                    Project.findOne({project_id:mongoose.Types.ObjectId(project_id)})
                        .exec((err,response: shopProjectSchema)=>{
                            if(response) {
                                response.project_cover = imgSrc
                                response.save((err) => {
                                    if(!err) {
                                        co(function* (){
                                            var result = yield client.delete(url.slice(url.indexOf('.com/') + 5))
                                            return res.json({code:200,data:imgSrc})
                                        })
                                    }
                                })
                            }
                        }) 
                else 
                    return res.json({code:200,data:imgSrc})
            }).catch(function(err){
                fs.unlinkSync(localFile)
                res.code({code:500,msg:'上传图片失败'})
            })
       }
    })
}

// 删除图片
export const removeImg = (req,res,next) => {
    let { url, good_id, project_id, newUrl } = req.body
    co(function* (){
        var result = yield client.delete(url.slice(url.indexOf('.com/') + 5))
        if(good_id) {
            Good.findOne({good_id:mongoose.Types.ObjectId(good_id)})
                .exec((err,response:shopGoodSchema)=>{
                    if(response) {
                        let imgsArr = response.good_imgs
                        imgsArr.splice(imgsArr.indexOf(url),1)
                        response.good_imgs = imgsArr
                        response.save((err) => {
                            if(!err) {
                                res.json({code:200,msg:'删除图片成功'})
                            }
                        })
                    }
                })
        } else if (project_id) {
             Project.findOne({project_id:mongoose.Types.ObjectId(project_id)})
                .exec((err,response:shopProjectSchema)=>{
                    if(response) {
                        response.project_cover = newUrl
                        response.save((err) => {
                            if(!err) {
                                return res.json({code:200,data:''})
                            }
                        })
                    }
                })
        } else {
            return res.json({code:200,msg:'删除图片成功'})
        }
        
    }).catch((err) => {
        res.json({code:200,msg:'未删除图片'})
    })
}

export const uploadImgs = (req,res,next) => {
    res.json({
        code: 1
    })
}
