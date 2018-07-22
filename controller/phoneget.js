var express = require('express')
var router = express.Router();
var Mobileinfo = require('../models/meta')
var bodyParser = require("body-parser")

// get device details
// recieves imei 
router.post('/phone/get', (req, res) => {
    var response = {}
    Mobileinfo.findOne({ imei: req.body.imei }, (err, data) => {
        if (!err && data) {
            if (data.device.features.length !== 0 && data.device) {
                response = {
                    status: 6,
                    body: {
                        info: "mobile data found successfully",
                        error: null,
                        content: data.device
                    }
                }
                res.send(JSON.stringify(response))
            } else {
                response = {
                    status: -10,
                    body: {
                        info: "mobile data empty",
                        error: null,
                        content: null
                    }
                }
                res.send(JSON.stringify(response))
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
                res.send(JSON.stringify(response))
            } else {
                response = {
                    status: -3,
                    body: {
                        info: "imei and token db error",
                        error: err,
                        content: null
                    }
                }
                res.send(JSON.stringify(response))
            }
        }
    })
})

module.exports = router
