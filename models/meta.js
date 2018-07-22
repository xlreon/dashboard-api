var mongoose = require('mongoose')

var mobileinfo = mongoose.Schema({
    imei: String,
    token: String,
    device: {
        deviceDetails: {
            os: String,
            battery: Number,
            wifi: String
        },
        features: [{ name: String, description: String }]
    }
})

module.exports = mongoose.model('Mobileinfo', mobileinfo)
