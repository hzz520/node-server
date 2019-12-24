import { 
    Schema,
    Document
} from 'mongoose'
import moment from 'moment'
import { 
    connection
} from '../../config/adminMongodb'

export interface shopActiviteSchema extends Document {
    _id: string
    activite_id: string
    activite_name: string
    activite_rank: string
    activite_desc: string
    meta: {
        createAt: moment.Moment,
        updateAt: moment.Moment
    }
}

const activiteSchema: Schema<shopActiviteSchema> = new Schema({
    _id:Schema.Types.ObjectId,
    activite_id:Schema.Types.ObjectId,
    activite_name: String,
    activite_rank:String,
    activite_desc:String,
    meta:{
        createAt:Date,
        updateAt:Date
    }
})

activiteSchema.pre('save', function (next) {
    if(this.isNew) {
       this.meta.createAt = this.meta.updateAt = moment()
    } else {
        this.meta.updateAt = moment()
    }
    next()
})

export default connection.model('Activite',activiteSchema)
