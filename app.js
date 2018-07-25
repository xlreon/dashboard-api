var express = require('express')
var mongoose = require('mongoose')
var cors = require('cors');

var test = require('./controller/test.js'),
    register = require('./controller/register.js'),
    login = require('./controller/login.js'),
    feature = require('./controller/feature.js'),
    geoloc = require('./controller/geoloc.js'),
    fileupd = require('./controller/fileupd.js'),
    fileget = require('./controller/fileget.js'),
    dbget = require('./controller/dbget.js'),
    tokenupdt = require('./controller/tokenupdt.js'),
    phoneset = require('./controller/phoneset.js'),
    phoneget = require('./controller/phoneget.js'),
    imeiget = require('./controller/imeiget.js'),
    passupd = require('./controller/passupd.js'),
    verify = require('./controller/verify.js')

var app = express()

mongoose.connect('mongodb://localhost:27017/db', { useNewUrlParser: true })

routes = [
    test,
    register,
    login,
    feature,
    geoloc,
    fileupd,
    fileget,
    dbget,
    tokenupdt,
    phoneset,
    phoneget,
    imeiget,
    passupd,
    verify
]

app.use(cors({ origin: 'http://localhost:3000' }));

// use routers
routes.map((route) => app.use(route))

// root route
app.get('/', (req, res) => {
    res.send('hello world')
})

// server port localhost://8080
app.listen("8080")
