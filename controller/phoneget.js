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
    Mobileinfo.findOne({ imei: req.body.imei }, (err, detail) => {
        if (!err && detail) {
            if (detail.ssid && detail.battery && detail.brand && detail.model && detail.gps && detail.data ) {
                response = {
                    status: 6,
                    body: {
                        info: "mobile data found successfully",
                        error: null,
                        ssid : detail.ssid,
                        battery: detail.battery,
                        brand: detail.brand,
                        model: detail.model,
                        gps: detail.gps,
                        data: JSON.parse(detail.data)
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
