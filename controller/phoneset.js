var express = require('express')
var router = express.Router();
var Mobileinfo = require('../models/meta')
var bodyParser = require("body-parser")

router.use(bodyParser.urlencoded({ extended: true }))
// set device details
// recieves imei and 
// device object with params os,battery,wifi,features
// features is an array of object with params name, description
router.post('/phone/set', (req, res) => {
    // console.log(req.body.specs)
    device_data = req.body.device
    Mobileinfo.findOneAndUpdate({ imei: req.body.imei }, { '$set': { 'device': device_data } }, { new: true }, (err, data) => {
        if (!err && data) {
            console.log(data)
        } else {
            console.log('Invalid IMEI')
            console.log('Error : ' + err)
        }
    })
})

module.exports = router