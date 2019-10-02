import * as express from 'express'
import * as path from 'path'
import * as bodyParser  from 'body-parser'
import * as cookie from 'cookie-parser'
import fcdn from './middleware/fcdn'
import * as Flog from './middleware/flog/index' 

import router from './router/index'

const app = express()

app.use(bodyParser.json({
    inflate:true,
    limit:5242880
}))

app.use(fcdn)
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
// app.use(['/blogs/', '/blogs/dist'], express.static('/Aliyun/blogs/dist'))
// app.use('/blogs/dist', express.static('/Aliyun/blogs/dist'))

app.use(cookie())

router(app)

app.listen('8001',function () {
    Flog.getLog('START').debug('app is listenning http://localhost:8001')
})
