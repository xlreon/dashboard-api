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
    var response = {}
    device_data = req.body.device
    Mobileinfo.findOneAndUpdate({ imei: req.body.imei }, { '$set': { 'device': device_data } }, { new: true }, (err, data) => {
        if (!err && data) {
            response = {
                status: 2,
                body: {
                    info: "New phone data updated",
                    error: null,
                    content: null
                }
            }
            res.send(response)
        } else {
            if (!data) {
                response = {
                    status: -9,
                    body: {
                        info: "invalid imei",
                        error: null,
                        content: null
                    }
                }
                res.send(response)
            } else {
                response = {
                    status: -3,
                    body: {
                        info: "imei and token db error",
                        error: err,
                        content: null
                    }
                }
                res.send(response)
            }
        }
    })
})

module.exports = router