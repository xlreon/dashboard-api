var express = require('express')
var mongoose = require('mongoose')

var test = require('./controller/test.js'),
    register = require('./controller/register.js'),
    login = require('./controller/login.js'),
    feature = require('./controller/feature.js'),
    geoloc = require('./controller/geoloc.js'),
    mult = require('./controller/mult.js'),
    multget = require('./controller/multget'),
    tokenupdt = require('./controller/tokenupdt.js'),
    phoneset = require('./controller/phoneset.js'),
    phoneget = require('./controller/phoneget.js')

var app = express()

mongoose.connect('mongodb://localhost:27017/dashboard', { useNewUrlParser: true })

routes = [
    test,
    register,
    login,
    feature,
    geoloc,
    mult,
    multget,
    tokenupdt,
    phoneset,
    phoneget
]

// use routers
routes.map((route)=>app.use(route))

// root route
app.get('/', (req, res) => {
    res.send('hello world')

})

// server port localhost://8080
app.listen("8080")
