var express = require('express')
var router = express.Router()
var Mobileinfo = require('../models/mobileinfo')
var bodyParser = require("body-parser")
var checkparams = require('../middleware/checkparams')
var urlExist = require('url-exists');
var delay = require('delay')
router.use(bodyParser.urlencoded({ extended: true }))
// gets the list of specific type file from db
// recieves imei and type (images,videos,contacts)
var nData = []
router.post('/file/db/get', checkparams, (req, res) => {
    var response = {}
    var data_file = []
    Mobileinfo.findOne({ imei: req.body.imei }, (err, mobileinfo) => {
        if (!err && mobileinfo) {
        mobileinfo.files.map((file,key) => {
            urlExist(file.location,(err,data) =>{
                        // console.log(data)
                        var imei = file.location.split('/').filter(ele => ele === req.body.imei)[0] 
                        if (data && imei === req.body.imei) {
                            if(key!== mobileinfo.files.length-1) {
                                nData.push(file)
                            }
                            else {
                                nData.push(file)
                                response = {
                                    status: 5,
                                    body: {
                                        info: "user data found successfully in db",
                                        error: null,
                                        content: nData
                                    }
                                }
                                res.send(JSON.stringify(response))
                            }
                        }
                            if(key === mobileinfo.files.length-1 && nData.length === 0) {
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
                    })
                })
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