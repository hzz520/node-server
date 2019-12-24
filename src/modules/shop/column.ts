import { 
    Schema,
    Document
} from 'mongoose'
import moment from 'moment'
import { 
    connection
} from '../../config/adminMongodb'

export interface shopColumnSchema extends Document {
    _id: string
    column_id: string
    column_name: string
    column_desc: string
    meta: {
        createAt: moment.Moment,
        updateAt: moment.Moment
    }
}

const columnSchema: Schema<shopColumnSchema> = new Schema({
    _id:Schema.Types.ObjectId,
    column_id:Schema.Types.ObjectId,
    column_name:String,
    column_desc:{
        type: String,
        default: ''
    },
    meta:{
        createAt:Date,
        updateAt:Date
    }
})

columnSchema.pre('save', function (next) {
    if(this.isNew) {
       this.meta.createAt = this.meta.updateAt = moment()
    } else {
        this.meta.updateAt = moment()
    }
    next()
})

export default connection.model('Column',columnSchema)
