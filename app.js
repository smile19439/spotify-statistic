if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

const express = require('express')
const exphbs = require('express-handlebars')
const session = require('express-session')

const routes = require('./routes')
const passport = require('./config/passport')
const handlebarsHelpers = require('./helpers/handlebars-helper')

const app = express()
const port = 3000

app.engine('handlebars', exphbs.engine({ defaultLayout: 'main', helpers: handlebarsHelpers }))
app.set('view engine', 'handlebars')

app.use(express.static('public'))
app.use(express.urlencoded({ extended: true }))

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true
}))
app.use(passport.initialize())
app.use(passport.session())

app.use((req, res, next) => {
  res.locals.loginUser = req.user
  next()
})

app.use(routes)

app.listen(port, () => {
  console.log(`app is running on http://localhost:${port}`)
})