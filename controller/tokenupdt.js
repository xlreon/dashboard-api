var express = require('express')
var router = express.Router()
var Mobileinfo = require('../models/meta')
var bodyParser = require("body-parser")

router.use(bodyParser.urlencoded({ extended: true }))

// update token
// recieves imei, new token
router.post('/token/update', (req, res) => {
    Mobileinfo.findOneAndUpdate({ imei: req.body.imei }, { '$set': { 'token': req.body.token } }, { new: true }, (err, data) => {
        if (!err && data) {
            console.log('Saved Successfully')
            console.log(data)
        } else {
            console.log('Save Error : ' + err)
        }
    })
})

module.exports = router
