const express = require("express")
const session = require('express-session')
const exphbs = require("express-handlebars")
const methodOverride = require("method-override")
const flash = require('connect-flash')

const routes = require("./routes")
require("./config/mongoose")

const usePassport = require('./config/passport')

const app = express()
const port = 3000

app.engine('handlebars', exphbs({
  defaultLayout: 'main',
  helpers: {
    //compare whether two values are equal or not.
    eq: function (value1, value2) {
      return value1 === value2
    }
  }
}))
app.set('view engine', 'handlebars')

app.use(session({
  secret: 'ThisIsMySecret',
  resave: false,
  saveUninitialized: true
}))

app.use(express.static("public"))
app.use(express.urlencoded({ extended: true }))
app.use(methodOverride("_method"))

usePassport(app)
app.use(flash())
app.use((req, res, next) => {
  // 你可以在這裡 console.log(req.user) 等資訊來觀察
  res.locals.isAuthenticated = req.isAuthenticated()
  res.locals.user = req.user
  res.locals.success_msg = req.flash('success_msg')  // 設定 success_msg 訊息
  res.locals.warning_msg = req.flash('warning_msg') // 設定 warning_msg 訊息

  next()
})

app.use(routes)

// start and listen on the Express server
app.listen(port, () => {
  console.log(`Express is listening on localhost:${port}`)
})