import mongoose from 'mongoose'
import * as Flog from '../middleware/flog/index'

export const connection = mongoose.createConnection(`mongodb://hzz520.site:27017`, {
    user: 'aliyun',
    pass: '1h2z3z2325076',
    dbName: 'wxShop',
    authSource: 'admin',
    useNewUrlParser: true,
    useUnifiedTopology: true
})

connection.on('error', () => {
    Flog.getLog('MONGDB').err('Mongoose connection admin error')
})

connection.on('connected', () => {
    Flog.getLog('MONGDB').debug('Mongoose connection admin success')
})