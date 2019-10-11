import { 
    Schema,
    Document
} from 'mongoose'
import { 
    connection
} from '../../config/adminMongodb'
import * as moment from 'moment'

export interface shopGoodSchema extends Document {
    _id: string
    good_id: string
    good_name: string
    good_activite_ids: string[]
    good_column_ids: string[]
    good_desc: string
    good_imgs: string[]
    good_oprice: string
    good_sprice: string
    good_dSaleCount: string
    good_oSaleCount: string
    good_status: string
    meta: {
        createAt: moment.Moment,
        updateAt: moment.Moment
    }
}

const goodSchema: Schema = new Schema({
    _id:Schema.Types.ObjectId,
    good_id:Schema.Types.ObjectId,
    good_name:String,
    good_activite_ids:[{
        type:Schema.Types.ObjectId,
        ref:'Activite'
    }],
    good_column_ids:[{
        type:Schema.Types.ObjectId,
        ref:'Column'
    }],
    good_desc:String,
    good_imgs:[{type:String}],
    good_oprice:String,
    good_sprice:String,
    good_dSaleCount:String,
    good_oSaleCount:{
        type:String,
        default:'0'
    },
    good_status:String,
    meta:{
        createAt:Date,
        updateAt:Date
    }
})

goodSchema.pre('save', function (next) {
    if(this.isNew) {
       this.meta.createAt = this.meta.updateAt = moment()
    } else {
        this.meta.updateAt = moment()
    }
    next()
})

goodSchema.pre('update', function (next) {
    this.update({},{$set:{'meta.updateAt': moment()}})
    next()
})


export default connection.model('Good',goodSchema)
