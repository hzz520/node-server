import { 
    Schema,
    Document
} from 'mongoose'
import { 
    connection
} from '../../config/adminMongodb'
import moment from 'moment'

export interface shopProjectSchema extends Document {
    project_id: string
    project_name: string
    project_cover: string
    meta: {
        createAt: moment.Moment,
        updateAt: moment.Moment
    }
}

const projectSchema: Schema<shopProjectSchema> = new Schema({
    project_id:String,
    project_name:String,
    project_cover:String,
    meta:{
        createAt:Date,
        updateAt:Date
    }
})

projectSchema.pre('save', function (next) {
    if(this.isNew) {
       this.meta.createAt = this.meta.updateAt = moment()
    } else {
        this.meta.updateAt = moment()
    }
    next()
})

export default connection.model('Project',projectSchema)
