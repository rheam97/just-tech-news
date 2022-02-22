const path = require('path')
const helpers = require('./utils/helpers')
const express = require('express')
const routes = require('./controllers')
const exphbs = require('express-handlebars')
const hbs = exphbs.create({helpers})
const sequelize = require('./config/connection')
const session = require('express-session')
const SequelizeStore = require('connect-session-sequelize')(session.Store)

const sess = {
    secret: 'Super secret',
    cookie: {},
    resave: false,
    saveUninitialized: true,
    store: new SequelizeStore({
        db: sequelize
    })
}

const { response } = require('express')

const app = express()
const PORT = process.env.PORT || 3001


app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(express.static(path.join(__dirname, '/public')))
app.engine('handlebars', hbs.engine)
app.set('view engine', 'handlebars')
app.use(session(sess))

app.use(routes)

sequelize.sync({force:false}).then(()=> {
    app.listen(PORT, ()=> console.log('Now listening!'))
})