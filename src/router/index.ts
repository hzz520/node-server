import * as  mongoose from 'mongoose'
import * as blog from '../controllers/apis/blog' 
import * as shop from '../controllers/apis/shop'
import getRouter from '../controllers/views/index'

mongoose.connect(`mongodb://47.94.193.216:27017/wxShop`, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})

const rules = {
    '/': getRouter('index'),
    '/boom': getRouter('boom'),
    '/blogs': getRouter('blogs'),
    '/admin': getRouter('admin')
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
        // key === 'verify' 
        // ? app.route('/api/chat/*').all(shop.verify) 
        // : 
        app.route(`/api/chat/${key}`).all(shop[key])
    })
}
