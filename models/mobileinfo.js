var mongoose = require('mongoose')

var mobileinfo = mongoose.Schema({
    imei: Number,
    token: String,
    device: {
        os: String,
        battery: Number,
        wifi: String,
        features: [{ name: String, description: String }]
    }
})

module.exports = mongoose.model('Mobileinfo', mobileinfo)