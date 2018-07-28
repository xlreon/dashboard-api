var session = require('express-session');

storeSession = (app) => {
app.use(session({
    secret: 'unique',
    resave: false,
    saveUninitialized: true
}))

app.use(function (req, res, next) {
    if (!req.session.otp) {
        req.session.otp = -1;
    }
    if(!req.session.passCode) {
        req.session.passCode = -1;
        // setTimeout(()=> {
        //     req.session.passCode = -2;
        // },150000)
    }
    next()
})
}
module.exports = storeSession;