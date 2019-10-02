import * as moment from 'moment'
import {
    Schema,
    Document
} from 'mongoose'

import { connection } from '../../config/subConnnection'

declare module "mongoose" {
    interface Document {
        meta?: {
            updateAt: moment.Moment
            createAt: moment.Moment
        }
    }
}

export interface blogUserSchema extends Document {
    _id: string
    name: string
    password: string
    avatar: string
    articles?: string[],
    meta: {
        createAt: moment.Moment,
        updateAt: moment.Moment
    }
}

const usersSchemas: Schema<blogUserSchema> = new Schema({
    _id:Schema.Types.ObjectId,
    name:String,
    password:String,
    avatar:{
        type:String,
        default:'http://egret.oss-cn-beijing.aliyuncs.com/i_4_2246533969x3386744293_21.jpg'
    },
    articles:[{
        type:Schema.Types.ObjectId,
        ref:'ArticleList'
    }],
    meta:{
        createAt:Date,
        updateAt:Date
    }
})

usersSchemas.pre('save',function(next){
    if(this.isNew) {
       this.meta.createAt = this.meta.updateAt = moment()
    } else {
        this.meta.updateAt = moment()
    }
    next()
})

export default connection.model('Users',usersSchemas)
