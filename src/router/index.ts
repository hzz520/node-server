import * as  mongoose from 'mongoose'
import * as blog from '../controllers/apis/blog' 
import * as shop from '../controllers/apis/shop'
import * as wx from '../controllers/apis/wx'
import getRouter from '../controllers/views/index'

mongoose.connect(`mongodb://aliyun:1h2z3z2325076@127.0.0.1:27017/wxShop?authSource=admin`, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})

mongoose.connection.on('error', () => {
    console.log('Mongoose connection error')
})

mongoose.connection.on('connected', () => {
    console.log('Mongoose connection success')
})

const rules = {
    '/': getRouter('index'),
    '/boom': getRouter('boom'),
    '/blogs': getRouter('blogs'),
    '/admin': getRouter('admin'),
    '/egret': getRouter('egret')
}

export default (app) => {
    Object.keys(rules).map(key => {
        let ctrl = rules[key]
        app.use(key, ctrl.default || ctrl)
    })

    Object.keys(blog).map(key => {
        app.route(`/api/blog/${key}`).all(blog[key])
    })
    Object.keys(shop).map(key => {
        app.route(`/api/chat/${key}`).all(shop[key])
    })
    Object.keys(wx).map(key => {
        app.route(`/api/${key}`).all(wx[key])
    })
}
