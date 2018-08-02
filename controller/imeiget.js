var express = require('express')
var router = express.Router();
var bodyParser = require("body-parser")
var User = require('../models/user')
var Mobileinfos = require('../models/mobileinfo')
var checkparams = require('../middleware/checkparams')

router.use(bodyParser.urlencoded({ extended: true }))

/// returns list of imei
// recieves email
router.post('/imei/get', checkparams, (req, res) => {
    var response = {}
    User.findOne({ email: req.body.email }).populate('mobileinfos').exec((err, user) => {
        if (!err && user) {
            var imei_arr = []
            for (i = 0; i < user.mobileinfos.length; i++) {
                imei_arr.push(user.mobileinfos[i].imei)
            }
            response = {
                status: 9,
                body: {
                    info: 'found list of imei\'s',
                    error: null,
                    content: imei_arr
                }
            }
            res.send(JSON.stringify(response))
        } else {
            if (!user) {
                response = {
                    status: -4,
                    body: {
                        info: "invalid email",
                        error: null,
                        content: null
                    }
                }
                res.send(JSON.stringify(response))
            } else {
                response = {
                    status: -2,
                    body: {
                        info: "user db eroor",
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