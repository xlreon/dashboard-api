var express = require('express')
var router = express.Router()
var Mobileinfo = require('../models/mobileinfo')
var bodyParser = require("body-parser")
var checkparams = require('../middleware/checkparams')

router.use(bodyParser.urlencoded({ extended: true }))

// update token
// recieves imei, new token
router.post('/token/update', checkparams, (req, res) => {
    var response = {}
    Mobileinfo.findOneAndUpdate({ imei: req.body.imei }, { '$set': { 'token': req.body.token } }, { new: true }, (err, data) => {
        if (!err && data) {
            response = {
                status: 2,
                body: {
                    info: "New token updated",
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
                        info: "imei and token db eroor",
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
