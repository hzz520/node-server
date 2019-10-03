import * as  mongoose from 'mongoose'
export const connection = mongoose.createConnection(`mongodb://root:root@127.0.0.1:27017/shop?authSource=admin`, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})

connection.on('error', () => {
    console.log('subMongoose connection error')
});
connection.on('connected', () => {
    console.log('subMongoose connection success')
});
