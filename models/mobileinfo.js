var mongoose = require('mongoose')

var mobileinfo = mongoose.Schema({
    imei: Number,
    token: String,
    device: {
        os: String,
        battery: Number,
        wifi: String
    }
})

module.exports = mongoose.model('Mobileinfo', mobileinfo)
