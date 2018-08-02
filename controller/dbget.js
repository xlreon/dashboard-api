var express = require('express')
var router = express.Router()
var Mobileinfo = require('../models/mobileinfo')
var bodyParser = require("body-parser")
var checkparams = require('../middleware/checkparams')

router.use(bodyParser.urlencoded({ extended: true }))
// gets the list of specific type file from db
// recieves imei and type (images,videos,contacts)
router.post('/file/db/get', checkparams, (req, res) => {
    var response = {}
    var data_file = []
    Mobileinfo.findOne({ imei: req.body.imei }, (err, mobileinfo) => {
        if (!err && mobileinfo) {
            for (i = 0; i < mobileinfo.files.length; i++) {
                if (mobileinfo.files[i].key === req.body.type) {
                    data_file.push(mobileinfo.files[i])
                }
            }
            if (data_file.length != 0) {
                response = {
                    status: 5,
                    body: {
                        info: "user data found successfully in db",
                        error: null,
                        content: data_file
                    }
                }
                res.send(JSON.stringify(response))
            } else {
                response = {
                    status: -8,
                    body: {
                        info: "user data empty or invalid file type",
                        error: null,
                        content: null
                    }
                }
                res.send(JSON.stringify(response))
            }
        } else {
            if (!mobileinfo) {
                response = {
                    status: -15,
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
                        info: "imei and token db eroor",
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