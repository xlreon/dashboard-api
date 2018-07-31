var mongoose = require('mongoose')

var mobileinfo = mongoose.Schema({
    imei: Number,
    token: String,
    ssid: String,
    battery: String,
    brand: String,
    model: String,
    gps: String,
    data: String,
    // device: {
    //     os: String,
    //     battery: Number,
    //     wifi: String,
    //     name : String,
    //     location : {
    //         lat : Number,
    //         lng : Number
    //     }
    // },
    files: [{
        key: String,
        name: String,
        location: String
    }]

})

module.exports = mongoose.model('Mobileinfo', mobileinfo)
