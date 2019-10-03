import * as  mongoose from 'mongoose'
import * as Flog from '../middleware/flog/index'
export const connection = mongoose.createConnection(`mongodb://aliyun:1h2z3z2325076@127.0.0.1:27017/shop?authSource=admin`, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})

connection.on('error', () => {
    Flog.getLog('MONGDB').err('subMongoose connection error')
});
connection.on('connected', () => {
    Flog.getLog('MONGDB').debug('subMongoose connection success')
});
