const Koa = require('koa')
const app = new Koa()
const views = require('koa-views')
const json = require('koa-json')
const onerror = require('koa-onerror')
const bodyparser = require('koa-bodyparser')
const logger = require('koa-logger')

const pv = require('./middleware/koa-pv')

const mongoose = require('mongoose')
const dbConfig = require('./dbs/config')
const index = require('./routes/index')
const users = require('./routes/users')
const session = require('koa-generic-session')
const Redis = require('koa-redis')
// error handler
onerror(app)

// session
app.keys = ['key', 'keyskeys']

app.use(session({
  key: 'mt',
  prefix: 'mtl',
  store: new Redis()
}))

// middlewares
app.use(bodyparser({
  enableTypes:['json', 'form', 'text']
}))

app.use(json())
app.use(logger())
app.use(require('koa-static')(__dirname + '/public'))

app.use(views(__dirname + '/views', {
  extension: 'pug'
}))

app.use(pv())

// logger
app.use(async (ctx, next) => {
  const start = new Date()
  await next()
  const ms = new Date() - start
  console.log(`${ctx.method} ${ctx.url} - ${ms}ms`)
})

// routes
app.use(index.routes(), index.allowedMethods())
app.use(users.routes(), users.allowedMethods())

// 连接数据库
mongoose.connect(dbConfig.dbs, {
  useNewUrlParser: true
})

// error-handling
app.on('error', (err, ctx) => {
  console.error('server error', err, ctx)
})

module.exports = app
