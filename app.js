var express = require('express')
var mongoose = require('mongoose')
var cors = require('cors');
var storeSession = require('./middleware/sessionStore');


var app = express()

mongoose.connect('mongodb://localhost:6000/db', { useNewUrlParser: true })

routes = [
    require('./controller/test.js'),
    require('./controller/register.js'),
    require('./controller/login.js'),
    require('./controller/feature.js'),
    require('./controller/geoloc.js'),
    require('./controller/fileupd.js'),
    require('./controller/fileget.js'),
    require('./controller/dbget.js'),
    require('./controller/tokenupdt.js'),
    require('./controller/phoneset.js'),
    require('./controller/phoneget.js'),
    require('./controller/imeiget.js'),
    require('./controller/passupd.js'),
    require('./controller/verify.js'),
    require('./controller/checkOtp'),
    require('./controller/resetPassword'),
    require('./controller/loginWeb')
]

// app.use(cors({ origin: 'http://localhost:3000' }));
app.use(cors({ origin: 'http://ec2-18-216-27-235.us-east-2.compute.amazonaws.com:3000' }));
storeSession(app);
// use routers
routes.map((route) => app.use(route))

// root route
app.get('/', (req, res) => {
    res.send('hello world')
})

// server port localhost://8080
app.listen("8080")
