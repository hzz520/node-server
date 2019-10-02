import {
    Schema,
    Document
} from 'mongoose'

import { connection } from '../../config/subConnnection'

export interface blogCommentSchema extends Document {
    _id: string
    reply: {
        name: string
        avatar: string
        message: string
        time: string
    }
    replyByOther: string
}

const commentSchema: Schema<blogCommentSchema> = new Schema({
    _id:Schema.Types.ObjectId,
    reply:{
        name:String,
        avatar:{
            type:Schema.Types.ObjectId,
            ref:'Users'
        },
        message:String,
        time:String
    },
    replyByOther:[{
        type:Schema.Types.ObjectId,
        ref:'replybyothers'
    }]
})

export default connection.model('comments',commentSchema)
