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
    next()
})
}
module.exports = storeSession;