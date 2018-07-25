var mongoose = require('mongoose')

var mobileinfo = mongoose.Schema({
    imei: Number,
    token: String,
    device: {
        os: String,
        battery: Number,
        wifi: String
    },
    files: [{
        key: String,
        name: String
    }]
})

module.exports = mongoose.model('Mobileinfo', mobileinfo)
