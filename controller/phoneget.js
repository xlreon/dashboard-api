var express = require('express')
var router = express.Router();
var Mobileinfo = require('../models/mobileinfo')
var bodyParser = require("body-parser")
var checkparams = require('../middleware/checkparams')

router.use(bodyParser.urlencoded({ extended: true }))
// get device details
// recieves imei 
router.post('/phone/get', checkparams, (req, res) => {
    var response = {}
    Mobileinfo.findOne({ imei: req.body.imei }, (err, data) => {
        if (!err && data) {
            if (data.device.os && data.device.battery && data.device.wifi && data.device.name ) {
                response = {
                    status: 6,
                    body: {
                        info: "mobile data found successfully",
                        error: null,
                        location : data.location,
                        content: data.device
                    }
                }
                res.send(response)
            } else {
                response = {
                    status: -10,
                    body: {
                        info: "mobile data empty",
                        error: null,
                        content: null
                    }
                }
                res.send(response)
            }
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
