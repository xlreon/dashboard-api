var mongoose = require('mongoose')

var mobileinfo = mongoose.Schema({
    imei: String,
    token: String
})

module.exports = mongoose.model('Mobileinfo', mobileinfo)