import { 
    Schema, 
    Document
} from 'mongoose'
import { 
    connection
} from '../../config/adminMongodb'
import * as moment from 'moment'

export interface shopUserDocument extends Document {
    _id: string
    username: string
    password: string
    permission: string
    permission_id: string
    role: number
    avatar: string
    meta: {
        createAt: moment.Moment
        updateAt: moment.Moment
    }
}

const userSchema: Schema<shopUserDocument> = new Schema({
    _id:Schema.Types.ObjectId,
    username:String,
    password:String,
    permission:{
        type:String,
        default:'-'
    },
    permission_id: {
        type: String,
        default: ''
    },
    role:{
        type: Number,
        default: 0
    },
    avatar:{
        type:String,
        default:'//egret.oss-cn-beijing.aliyuncs.com/i_4_2246533969x3386744293_21.jpg'
    },
    meta:{
        createAt: Date,
        updateAt:Date
    }
})

userSchema.pre('save',function(next){
    if(this.isNew) {
       this.meta.createAt = this.meta.updateAt = moment()
    } else {
        this.meta.updateAt = moment()
    }
    next()
})

export default connection.model('User',userSchema)

