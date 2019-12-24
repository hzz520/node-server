import {
    Schema,
    Document
} from 'mongoose'
import moment from 'moment'

import { connection } from '../../config/blogsMongodb'

declare module "mongoose" {
    interface Document {
        time?: {
            date: moment.Moment
            day: string
            minute: string
            month: string
            year: string
        } | string
    }
}

export interface blogArticleListSchema extends Document {
    _id: string
    name: string
    title: string
    content: string
    pv: number
    cover: string
    comments: string[]
    praises: string[]
    time: {
        date: moment.Moment
        day: string
        minute: string
        month: string
        year: string
    }
}

const articleListSchemas: Schema<blogArticleListSchema> =  new Schema({
    _id: Schema.Types.ObjectId,
    name:String,
    title:String,
    content:String,
    category:String,
    pv:{
        type:Number,
        default:0
    },
    cover:String,
    comments:[{
        type: Schema.Types.ObjectId,
        ref:'comments'
    }],
    praises:{
        type:[String],
        default:[]
    },
    time:{
        date:Date,
        day:String,
        minute:String,
        month:String,
        year:String
    }
})

articleListSchemas.pre('save',function(next){
    if(this.isNew) {
        var t = moment()
        this.time = {
            date: t,
            day: t.format('YYYY-MM-DD'),
            minute: t.format('YYYY-MM-DD HH:mm'),
            month: t.format('YYYY-MM'),
            year: t.format('YYYY')
        }
    }
    next()
})

export default connection.model('ArticleList',articleListSchemas)
