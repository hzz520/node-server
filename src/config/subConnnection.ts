import * as  mongoose from 'mongoose'
export const connection = mongoose.createConnection(`mongodb://47.94.193.216:27017/shop`, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
