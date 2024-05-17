const express = require('express')
const path = require('path')
const flash = require('connect-flash')
const csurf = require('csurf')
const mongoose = require('mongoose')
const exphbs = require('express-handlebars')
const session = require('express-session')
const MongoStore = require('connect-mongodb-session')(session)
const methodOverride = require('method-override')
const homeRoutes = require('./routes/home')
const cardRoutes = require('./routes/card')
const ticketsRoutes = require('./routes/tickets')
const addRoutes = require('./routes/add')
const ordersRoutes = require('./routes/orders')
const AuthRoutes = require('./routes/auth')
const varMiddleware = require('./middleware/variables')
const userMiddleware = require('./middleware/user')
const app = express()
const { allowInsecurePrototypeAccess } = require('@handlebars/allow-prototype-access');
const Handlebars = require('handlebars');

const MONGODB_URI = `mongodb+srv://aykarzumanyan:3RQs393QXAAD5Gfo@cluster1.jovagfv.mongodb.net/?retryWrites=true&w=majority&appName=Cluster1`


const hbs = exphbs.create({
    defaultLayout: 'main',
    extname: 'hbs',
    handlebars: allowInsecurePrototypeAccess(Handlebars)
})

const store = new MongoStore({
    collection: 'sessions',
    uri: MONGODB_URI
})

// Регистрируем движок 
app.engine('hbs', hbs.engine)
// Используем движок 
app.set('view engine', 'hbs')
app.set('views', 'views')


// Делаем папку public статической 

app.use(express.static(path.join(__dirname, 'public')))
app.use(express.urlencoded({ extended: true }))
app.use(session({
    secret: 'some secret value', // Строка для шифрования сессий
    resave: false,
    saveUninitialized: false,
    store
}))

app.use(methodOverride('_method'))
app.use(csurf())
app.use(flash())
app.use(varMiddleware)
app.use(userMiddleware)

app.use('/', homeRoutes)
app.use('/tickets', ticketsRoutes)
app.use('/add', addRoutes)
app.use('/card', cardRoutes)
app.use('/orders',ordersRoutes)
app.use('/auth',AuthRoutes)

const PORT = process.env.PORT || 3000

async function start() {
    try {
        await mongoose.connect(MONGODB_URI) // Подключение к бд 
        app.listen(PORT, () => {
            console.log(`server is started, Port:${PORT}`)
        })
    } catch (e) {
        console.log(e)
    }

}
start()

