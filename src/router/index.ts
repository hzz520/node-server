import * as  mongoose from 'mongoose'
import * as blog from '../controllers/apis/blog' 
import * as shop from '../controllers/apis/shop'

mongoose.connect(`mongodb://47.94.193.216:27017/wxShop`, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})

const rules = {
    '/blogs': require('../controllers/views/blog'),
    '/admin': require('../controllers/views/admin')
}

export default (app) => {
    Object.keys(blog).map(key => {
        app.route(`/api/blog/${key}`).all(blog[key])
    })
    Object.keys(shop).map(key => {
        // key === 'verify' 
        // ? app.route('/api/chat/*').all(shop.verify) 
        app.route(`/api/chat/${key}`).all(shop[key])
    })

    Object.keys(rules).map(key => {
        let ctrl = rules[key]
        app.use(key, ctrl.default || ctrl)
    })
}
