var express = require('express')
var router = express.Router();
var Mobileinfo = require('../models/meta')
var bodyParser = require("body-parser")

// get device details
// recieves imei 
router.post('/phone/get', (req, res) => {
    Mobileinfo.findOne({ imei: req.body.imei }, (err, data) => {
        if (!err && data) {
            console.log(data.device)
        } else {
            console.log('No such device')
            console.log('Error : ' + err)
        }
    })
})

module.exports = router
