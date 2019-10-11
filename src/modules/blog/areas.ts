import {
    Schema,
    Document
} from 'mongoose'

import { connection } from '../../config/blogsMongodb'

export interface blogAreasSchema extends Document {
    _id: string
    code: number
    pcode: number
    name: string
}

const AreasSchemas: Schema<blogAreasSchema> =  new Schema({
    _id: Schema.Types.ObjectId,
    code:Number,
    pcode:Number,
    name:String
})

export default connection.model('Areas', AreasSchemas)

