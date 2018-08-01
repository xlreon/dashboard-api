var mongoose = require('mongoose')

var emailOtp = mongoose.Schema({
    email: String,
    otp: String
})

module.exports = mongoose.model('EmailOtp', emailOtp)
