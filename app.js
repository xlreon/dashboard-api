var express = require('express')
var mongoose = require('mongoose')



var test = require('./controller/test.js'),
    register = require('./controller/register.js'),
    login = require('./controller/login.js'),
    feature = require('./controller/feature.js'),
    geoloc = require('./controller/geoloc.js'),
    mult = require('./controller/mult.js'),
    tokenupdt = require('./controller/tokenupdt.js'),
    phoneset = require('./controller/phoneset.js'),
    phoneget = require('./controller/phoneget.js')

var app = express()

mongoose.connect('mongodb://localhost:27017/dashboard', { useNewUrlParser: true })

// use routers
app.use(test)
app.use(register)
app.use(login)
app.use(feature)
app.use(geoloc)
app.use(mult)
app.use(tokenupdt)
app.use(phoneset)
app.use(phoneget)

// root route
app.get('/', (req, res) => {
    res.send('hello world')

})

app.listen("8080")
