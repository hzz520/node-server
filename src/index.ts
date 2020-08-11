/*
 * @Descripttion: 
 * @version: 
 * @Author: zhongzhen.hzz
 * @Date: 2020-03-22 15:35:41
 * @LastEditors: zhongzhen.hzz
 * @LastEditTime: 2020-08-11 20:03:12
 */
import express from 'express'
import netjet from 'netjet'
import path from 'path'
import bodyParser  from 'body-parser'
import cookie from 'cookie-parser'
import Flog from './middleware/flog/index'
import favicon from 'serve-favicon'
import fcdn from './middleware/fcdn'

import router from './router/index'

// import './config/redis'

const app = express()

app.use(bodyParser.json({
    inflate:true,
    limit:5242880
}))
app.use(favicon(path.join(__dirname, '../static', 'favicon.ico')))

app.use(fcdn)
app.use(cookie())
app.use(Flog.express())

app.use(bodyParser.urlencoded({extended:true}))

// 模版资源存放位置
app.set('views', path.join(__dirname, '../views'))
// 模版引擎
let root = path.join(__dirname, '../views')

// 模版资源存放位置
app.set('views', root)
// 模版引擎
app.set('view engine', 'vm')
let Engine = require('velocity').Engine

app.engine('vm', (tpl, context, fn) => {
  try {
    const engine = new Engine({
      template: path.join(tpl),
      root
    })
    let str = engine.render(context)
    // 替换velocity模版渲染多余出来的换行
    .replace(/((\s{0,})(\n))/g, ($0, $1, $2, $3) => {
      return $3
    })
    // 替换首行换行
    .replace(/^\n/, '')

    fn(null, str)
  } catch (error) {
    fn(error, '')
  }
})

app.use(netjet({
  cache: { max: 100 }
}))

router(app)

app.use('/threejs', express.static(path.resolve(__dirname, '../../threejs/examples')))
app.use('/build', express.static(path.resolve(__dirname, '../../threejs/build')))

app.get('/jianli', (req, res, next) => {
  res.sendFile(path.resolve(__dirname, '../static/jianli/index.html'))
})

app.use('/static', express.static(path.resolve(__dirname, '../static')))
app.use('/', express.static(path.resolve( process.env.NODE_ENV === 'development' ? '/Aliyun' : '/opt', './egret/bin-release/web/2018')))

app.listen('8002',function () {
    Flog.getLog('STARTSERVER').debug('app is listenning http://localhost:8002')
    process.on('uncaughtException', (err) => {
      Flog.getLog('ERROR').err('err' + err)
      process.exit(1)
    })
    process.on('unhandledRejection', (err) => {
      Flog.getLog('ERROR').err('err1' + err)
    })
})