import * as blog from '../controllers/apis/blog' 
import * as shop from '../controllers/apis/shop'
import * as wx from '../controllers/apis/wx'
import * as test from '../controllers/apis/test' 
import getRouter from '../controllers/views/index'

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

    Object.keys(test).map(key => {
        app.route(`/api/test/${key}`).all(test[key])
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
