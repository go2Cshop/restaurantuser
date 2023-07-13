const express = require("express")
const session = require('express-session')
const exphbs = require("express-handlebars")
const methodOverride = require("method-override")
const routes = require("./routes")
require("./config/mongoose")

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
app.use(routes)

// start and listen on the Express server
app.listen(port, () => {
  console.log(`Express is listening on localhost:${port}`)
})