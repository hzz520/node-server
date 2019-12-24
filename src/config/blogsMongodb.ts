import mongoose from 'mongoose'
import * as Flog from '../middleware/flog/index'
export const connection = mongoose.createConnection(`mongodb://hzz.letin2586.com:27017`, {
    user: 'aliyun',
    pass: '1h2z3z2325076',
    dbName: 'shop',
    authSource: 'admin',
    useNewUrlParser: true,
    useUnifiedTopology: true
})

connection.on('error', () => {
    Flog.getLog('MONGDB').err('mongoose connection blogs error')
});
connection.on('connected', () => {
    Flog.getLog('MONGDB').debug('mongoose connection blogs success')
});
