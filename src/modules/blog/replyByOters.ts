import {
    Schema,
    Document
} from 'mongoose'

import { connection } from '../../config/subConnnection'

export interface blogReplyByOtherSchema extends Document {
    _id: string
    avatar: string
    answerBy: string
    answerTo: string
    message: string
    time: string
}

const replyByOtherSchema: Schema<blogReplyByOtherSchema> = new Schema({
    _id:Schema.Types.ObjectId,
    avatar:{
        type:Schema.Types.ObjectId,
        ref:'Users'
    },
    answerBy:String,
    answerTo:String,
    message:String,
    time:String
})

export default connection.model('replybyothers',replyByOtherSchema)
