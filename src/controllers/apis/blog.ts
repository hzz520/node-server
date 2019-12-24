
import path from 'path'
import fs from 'fs'
import mongoose from 'mongoose'
import uuid from 'uuid'
import moment from 'moment'
import multiparty from 'multiparty'
import co from 'co'

import client from '../../config/oss'

import ArticleList, { blogArticleListSchema } from '../../modules/blog/articleList'
import Comments from '../../modules/blog/comments'
import ReplyByOther from '../../modules/blog/replyByOters'
import Users, { blogUserSchema } from '../../modules/blog/users'

export const articleList = (req,res,next) => {
    
    if(req.body._id){
        let { _id,page,limitNum } = req.body
        let limitNums = limitNum || 5
        let id = mongoose.Types.ObjectId(_id)
        let skip = limitNums * (page-1)
        let count = 0
       
        ArticleList.findOne({
            _id:id
        })
        .exec((err,response: any) => {
            if(response==null)
                res.json({code:1,message:'id不存在'}) 
            else {
                count = response.comments.length
               
                ArticleList.updateOne({_id:_id},{$inc:{pv:1}},function(err,response1){
                    ArticleList.findOne({
                        _id:id
                    })
                    .populate({
                        path:'comments',
                        populate:[
                            {
                                path:'reply.avatar',
                                options:{
                                   select:'avatar _id' 
                                }
                            },
                            {
                                path:'replyByOther',
                                populate:{
                                    path:'avatar',
                                    options:{
                                        select:'avatar _id'  
                                    }
                                }
                            }
                            
                        ],
                        options:{
                            sort:{
                                _id:-1
                            },
                            skip:skip,
                            limit:5 
                        }
                    })
                    .exec(function(err,response3){
                        res.json({code:0,data:{article:response3,count:count,pageNum:Math.ceil(count/limitNums)}})
                    })
                    
                })   
            }
                
        })
    } else if (!req.body.userId){
        
        let limitNum = req.body.limitNum
        let skip = (req.body.page - 1) * limitNum
        let count = 0
        
        if(req.body.type != 'serch'){
            let condition = req.body.type == 'category' ? {category:req.body.category} : {}

            ArticleList.count(condition,function(err,count){
                count = count
                ArticleList.find(condition,'-comments').sort({_id: -1}).skip(skip).limit(limitNum).exec(function(err,response){
                    res.json({code:0,data:{articleList:response,count:count,pageNum:Math.ceil(count/limitNum)}})
                })
            })
            
           
        } else  {
            let keyword = req.body.keyword
            let reg = new RegExp(keyword,'i')
            let condition = {
                $or: [
                    { title:{ $regex: reg }},
                    { name:{ $regex: reg }},
                    { content:{ $regex: reg }}
                ]
            }

            ArticleList.count(condition,function(err,count){
                count = count
                ArticleList.find(condition,'-comments').sort({_id:-1}).skip(skip).limit(limitNum).exec(function(err,response){
                    res.json({code:0,data:{articleList:response,count:count,pageNum:Math.ceil(count/limitNum)}})
                })
            })

            
        }
    } else {
        let limitNum = req.body.limitNum
        let skip = (req.body.page - 1) * limitNum
        let count = 0

        let match

        if(req.body.category == '1'){
            match = {category:'1'}
        } else if(req.body.category=='2'){
             match = {category:'2'}
        } else {
            match = {}
        }

        Users.findOne({_id:mongoose.Types.ObjectId(req.body.userId)})
            .populate({
                path:'articles',
                match:match,
                options:{
                    select:'-comments',
                    sort:{_id:-1},
                    skip:skip,
                    limit:limitNum||5
                }
            })
            .exec(function(err,response: any){
                if(!err){
                    if(response){
                        count = response.articles.length
                        res.json({code:0,message:'成功',data:{articleList:response.articles,count:count,pageNum:Math.ceil(count/limitNum)}})
                    } else {
                        res.json({code:1,message:'用户不存在'})
                    }
                }
            })
    }
}

export const publish = (req,res,next) => {

    let form = new multiparty.Form({uploadDir: path.resolve(__dirname,'../')})
    
     form.parse(req,function(err,fields,files){

        let {name,title,content,category,pv,_id} = JSON.parse(fields.data[0])
        let cover = JSON.stringify(files,null,2)
        
   
        Users.findOne({name:name}).exec(function(err,response: any){
            
            if(!err && response){
                
                if(Object.keys(files).length>0){
                
                    let key = uuid.v1()
                    let localFile = files.cover[0].path

                    
                    co(function* () {
                        let result = yield client.put(key, localFile)

                        
                        let imgSrc = '//egret.oss-cn-beijing.aliyuncs.com/' + result.name

                        let article = new ArticleList({
                            _id:new mongoose.Types.ObjectId(),
                            name:name,
                            title:title,
                            content:content,
                            category:category,
                            cover:imgSrc
                        })

                        article.save(function(err,articlelists){
                            if(!err){
                                response.articles.push(article._id)
                                response.save(function(err,response1){
                                    fs.unlinkSync(localFile)
                                    res.json({code:0,message:'发布成功'})
                                })   
                            }   
                        })

                    }).catch(function (err) {
                        fs.unlinkSync(localFile)
                        res.send({code:1,message:'上传图片失败',error:JSON.stringify(err)})
                    })
                } else{
                    let article = new ArticleList({
                        _id:new mongoose.Types.ObjectId(),
                        name: name,
                        title:title,
                        content:content,
                        category:category
                    }) 
                
                    article.save(function(err,articlelists){
                        
                        if(!err){
                            response.articles.push(article._id)
                            response.save(function(err,response1){
                            
                                res.json({code:0,message:'发布成功'})
                            }) 
                        }
                            
                    })
                }
            } else {
                res.json({code:1,message:'用户名不存在'})
            }
        })
     })
    
     
}

export const login = (req,res,next) => {
    let { name,password } = req.body
    
    Users.find({name:name},function(err,response: {[key:string]: any}[]){
        if(response.length==0)
            res.json({code:1,message:'用户名不存在',data:{}})
        else {
            Users.find({name:name,password:password},'name avatar _id')
                .exec(function(err,response: {[key:string]: any}[]){
                    if(response.length==0){
                        res.json({code:1,message:'密码输入错误',data:{}})
                    } else {
                        
                        res.cookie('name',response[0].name,{maxAge:3600*1000})
                        res.json({code:0,message:'登录成功',data:response[0]})
                    }
                })
        }
    })
    
    
}

export const register = (req,res,next) => {
    let { name,password } = req.body
   
    Users.find({name:name})
        .exec(function(err,response){
            if(response.length==1){
                res.json({code:1,message:'用户名已经存在'})
            } else{
                let user = new Users({
                    _id:new mongoose.Types.ObjectId(),
                    name:name,
                    password:password
                })
                user.save(function(err,users){
                    if(!err){
                        res.json({code:0,message:'用户注册成功'})
                    }
                })
            }
        })
}

export const getUserInfo = (req,res,next) => {
    let { name } = req.cookies
    Users.find({name:name},'name avatar _id')
        .exec(function(err,response){
            if(!err){
                if(response.length==1){
                    res.json({code:0,data:response[0]})
                } else {
                    res.json({code:1,data:{}})
                }
            }
        })
}

export const updateUserInfo = (req,res,next) => {
    let { name, avatar, oldPassword, newPassword, type } = req.body

    if(avatar != ''&& type=='avatar'){
         Users.findOne({name:name}).exec(function(err,response: blogUserSchema){
                if(response.avatar != "//egret.oss-cn-beijing.aliyuncs.com/i_4_2246533969x3386744293_21.jpg")
                    co(function*(){
                        let result = yield client.delete(response.avatar.slice(response.avatar.lastIndexOf('/')+1)) 
                    })
                
                let fileName = uuid.v1()
                let filePath = './' + fileName  + '.png'


                let base64Data = avatar.replace(/^data:image\/[.|\w]+;base64,/,'')
                let bufferData = new Buffer(base64Data,'base64')
                fs.writeFile(filePath,bufferData,function(err){
                    if(err){
                        res.send({status:'102',msg:'文件写入失败'})
                    } else {
                        let localFile =  filePath
                        let key = fileName

                        
                        co(function* () {
                            let result = yield client.put(key, localFile)
                        
                            let imageSrc = '//egret.oss-cn-beijing.aliyuncs.com/' + result.name

                            fs.unlinkSync(filePath)
                            
                            response.avatar = imageSrc
                            response.save(function(err,response1){
                                res.json({code:0,message:'更新头像成功',data:{
                                    isLogin:true,
                                    info:{
                                        name:response.name,
                                        avatar:response.avatar,
                                        _id:response._id
                                    }
                                }})
                            })
                        }).catch(function (err) {
                            
                            fs.unlinkSync(filePath)
                            res.send({code:1,message:'更新头像失败'})
                        })  
                
                    }
                })

         }) 
    } else{
        Users.findOne({name:name,password:oldPassword})
            .exec(function(err,response: blogUserSchema){
                if(!response){
                    res.json({code:1,message:'原始密码错误'})
                }

                response.password = newPassword
                response.save(function(err, response1: blogUserSchema){
                    res.json({code:0,message:'更新密码成功',data:{
                        isLogin:true,
                        info:{
                            name:response.name,
                            avatar:response.avatar,
                            _id:response._id
                        }
                    }})
                })
            })
    }
}

export const loginOut = (req,res,next) => {
     res.cookie('name','null',{maxAge:0})
     res.json({code:0,message:'退出登录成功'})
}

export const comments = (req,res,next) => {
    let { _id, message, type, answerBy, answerTo, limitNum,userId } = req.body
    let id = mongoose.Types.ObjectId(_id)
    
    if(type == 'article') {
        ArticleList.findOne({_id:id})
            .exec((err,response: any)=>{
                if(response == undefined){
                    res.json({code:1,message:'id不存在'})
                } else {
                    
                    let comment = new Comments({
                        _id:new mongoose.Types.ObjectId(),
                        reply:{
                            name:answerBy,
                            avatar:mongoose.Types.ObjectId(userId),
                            message:message,
                            time:moment().format('YYYY-MM-DD HH:mm')
                        }
                    })
                    comment.save(function(err){
                        if(!err){
                            response.comments.push(comment._id)
                            
                            response.save(function(err){
                                if(!err){
                                    ArticleList.findOne({_id:id})
                                        .populate({
                                            path:'comments',
                                            populate:{
                                                path:'reply.avatar',
                                                options:{
                                                   select:'avatar _id' 
                                                }
                                            },
                                            options:{
                                                sort:{
                                                    _id:-1
                                                },
                                                limit:1
                                            }
                                        }).exec(function(err,response1: any){
                                            res.json({
                                                code:0,
                                                message:'留言成功',
                                                data:{
                                                    comment:response1.comments[0],
                                                    count:response.comments.length,
                                                    pageNum:Math.ceil(response.comments.length/(limitNum||5))
                                                }
                                            })
                                        })
                                    
                                }
                                else
                                    res.json({code:1,message:'留言失败'})
                            })
                            
                        } else {
                            res.json({code:1,message:'留言失败'})
                        }
                    })
                } 
                    
            })        
    } else {
        
        Comments.findOne({_id:id})
            .exec(function(err,response: any){
                if(response==undefined)
                    res.json({code:1,message:'id不存在'})
                else {
                    let replybyother = new ReplyByOther({
                        _id:new mongoose.Types.ObjectId(),
                        answerBy:answerBy,
                        answerTo:answerTo,
                        avatar:mongoose.Types.ObjectId(userId),
                        message:message,
                        time:moment().format('YYYY-MM-DD HH:mm')
                    })
                    replybyother.save(function(err){
                        if(!err){
                            response.replyByOther.push(replybyother._id)
                            response.save(function(err){
                                if(!err){
                                    Comments.findOne({_id:id})
                                        .populate({
                                            path:'replyByOther',
                                            options:{
                                                sort:{_id:-1},
                                                limit:1
                                            },
                                            populate:{
                                                path:'avatar',
                                                options:{
                                                    select:'avatar'
                                                }
                                            }
                                        })
                                        .exec(function(err,response1: any){
                                            res.json({code:0,message:'留言成功',data:response1.replyByOther[0]})
                                        })
                                    
                                }
                                else
                                    res.json({code:1,message:'留言失败'})
                            })
                        } else 
                            res.json({code:1,message:'留言失败'})
                    })
                }
            })
    }
}


export const commentspage = (req,res,next) => {
    let { page, limitNum, _id } = req.body
    let limitNums = limitNum || 5
    let skip = limitNums *( page -1)
    let id = mongoose.Types.ObjectId(_id)
    let pageNum = 0
    let count = 0
    
    ArticleList.findOne({_id:id})
        .exec(function(err,response: blogArticleListSchema){
            if(err)
                return
            if(response == undefined){
                res.json({code:1,message:'文章不存在'})
                return
            }
            
            count = response.comments.length
            
            ArticleList.findOne({_id:id})
                .populate({
                    path:'comments',
                    populate:[
                        {
                            path:'replyByOther',
                            populate:{
                                path:'avatar',
                                options:{
                                    select:'avatar'
                                }
                            }
                        },
                        {
                            path:'reply.avatar',
                            options:{
                                select:'avatar'
                            }
                        }
                    ],
                    options:{
                        sort:{_id:-1},
                        skip:skip,
                        limit:limitNum
                    }
                })
                .exec(function(err,response: any){
                       
                    res.json({code:0,message:'成功',data:{
                        comments:response.comments,
                        count:count,
                        pageNum:Math.ceil(count/limitNums)
                    }})
                
                })
        })

    
}

export const del = (req,res,next) => {
    let { articleId, commentId, subcommentId ,type, key } = req.body
    if(type=='comment') {
        ArticleList.findOne({_id:mongoose.Types.ObjectId(articleId)})
            .exec(function(err,response: any){
                
                response.comments.splice(key,1)
                response.save(function(err,response1){
                    Comments.findOne({_id:mongoose.Types.ObjectId(commentId)})
                    .exec(function (err,response2: any) {
                        if(response2.replyByOther.length>0)
                            response2.replyByOther.forEach(function(el,i,arr){
                                ReplyByOther.findOneAndRemove({_id:mongoose.Types.ObjectId(el)},function(err,response3){
                                    
                                })

                        })
                        Comments.findOneAndRemove({_id:mongoose.Types.ObjectId(commentId)},function(err,response4){
                            res.json({code:0,message:'删除成功'})
                        })
                    })
                })
            
            })
    } else {
        Comments.findOne({_id:mongoose.Types.ObjectId(commentId)})
            .exec(function(err,response: any){
                if(response){
                    response.replyByOther.splice(key,1)
                    response.save(function(err,response){
                        ReplyByOther.findOneAndRemove({_id:mongoose.Types.ObjectId(subcommentId)},function(err){
                            if(!err){
                                res.json({code:0,message:'删除成功',count:response.replyByOther.lenth})
                            }
                        })
                    })
                } else {
                    res.json({code:1,message:'删除失败'})
                }
            })
    }
}

export const addOneComment = (req,res,next) => {
    let { page, _id, limitNum } = req.body
    
    
    ArticleList.findOne({_id:mongoose.Types.ObjectId(_id)})
        .exec(function(err,response: any){
            if(response){
              let temp =  response.comments[response.comments.length - page*(limitNum||5)]
              
              Comments.findOne({_id:mongoose.Types.ObjectId(temp)})
                .populate('replyByOther')
                .exec(function(err,response){
                    if(response) {
                        res.json({code:0,message:'成功',data:{comment:response}})
                    } else {
                        res.json({code:1,message:'失败'})
                    }
                })
            } else {
                res.json({code:1,message:'id不存在'})
            }
        })
}

export const delArticle = (req,res,next) => {
    let { articleId,limitNum,page,type,userId,index } = req.body

    Users.findOne({_id:mongoose.Types.ObjectId(userId)})
        .exec(function(err,response: blogUserSchema){
            
            response.articles.splice(response.articles.length-1-index,1)
            response.save(function(err,response){

                ArticleList.findOne({_id:mongoose.Types.ObjectId(articleId)}).exec(
                    function(err,response: any){
                        if(!err){
                            
                            if(response.cover!=''&&response.cover!=undefined){
                                
                                co(function* () {
                                    let result = yield client.delete(response.cover.slice(response.cover.lastIndexOf('/')+1));
                                    
                                }).catch(function (err) {
                                    
                                });
                            }
                            
                            if(response.comments.length>0){
                                response.comments.forEach(function(el,index,arr){
                                   
                                    Comments.findOneAndRemove({_id:mongoose.Types.ObjectId(el)},function(err,response: any){
                                        if(!err){
                                            if(response.replyByOther.length>0){
                                                response.replyByOther.forEach(function(el,index,arr){
                                                    ReplyByOther.findOneAndRemove({_id:mongoose.Types.ObjectId(el)},function(err,response){
                                                        
                                                    })
                                                })
                                                
                                            }
                                        }
                                    })
                                })
                            }

                            let match = {}
                            if(req.body.category == '1'){
                                match = { category: '1' } 
                            } else if(req.body.category == '2') {
                                match = { category: '2' } 
                            }
                            ArticleList.findOneAndRemove({_id:mongoose.Types.ObjectId(articleId)},function(err,response){

                            
                                Users.findOne({_id:mongoose.Types.ObjectId(userId)})
                                    .populate({
                                        path:'ArticleList',
                                        match:match,
                                        options:{
                                            sort:{_id:-1}
                                        }
                                    })
                                    .exec(function(err,response: any){
                                        let count = response.articles.length
                                        Users.findOne({_id:mongoose.Types.ObjectId(userId)})
                                            .populate({
                                                path:'articles',
                                                match:match,
                                                options:{
                                                    sort:{_id:-1},
                                                    select:'-comments',
                                                    skip:(page - 1) * (limitNum||5),
                                                    limit:limitNum || 5
                                                }
                                            }).exec(function(err,response: any){
                                                res.json({code:0,message:'删除成功',data:{
                                                    count:count,
                                                    pageNum:Math.ceil(count/(limitNum||5)),
                                                    articleList:response.articles
                                                }})
                                            })
                                    })
                            
                                })
                    
                        }
                    })
                })
            })
    
    
}

export const test = (req, res, next) => {
    res.json({ code: 0, msg: 111 })
}
