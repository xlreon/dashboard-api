var express = require('express')
var router = express.Router();
var Mobileinfo = require('../models/mobileinfo')
var bodyParser = require("body-parser")
var checkparams = require('../middleware/checkparams')

router.use(bodyParser.urlencoded({ extended: true }))
// set device details
// recieves imei and 
// device object with params os,battery,wifi,name,location
router.post('/phone/set', checkparams, (req, res) => {
	console.log(req)
    var response = {}
    Mobileinfo.findOneAndUpdate({ imei: req.body.imei }, { '$set': { 'ssid': req.body.ssid, 'battery': req.body.battery, 'brand': req.body.brand, 'model': req.body.model, 'gps': req.body.gps,'data': req.body.data }}, { new: true }, (err, data) => {
        if (!err && data) {
            response = {
                status: 2,
                body: {
                    info: "New phone data updated",
                    error: null,
                    content: null
                }
            }
            res.send(JSON.stringify(response))
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