var express = require('express')
var router = express.Router();
var User = require('../models/user')
var Mobileinfo = require('../models/meta')
var easyPbkdf2 = require("easy-pbkdf2")()
var salt = easyPbkdf2.generateSalt();
var bodyParser = require("body-parser")

router.use(bodyParser.urlencoded({ extended: true }))

// user login
// recieves email,password,imei,token
router.post('/login', (req, res) => {
    // var email = req.body.email
    // var password = req.body.password
    // var imei = req.body.imei
    // var hashedPassword = password

    User.findOne({ email: req.body.email }, (err, user) => {
        if (!err) {
            console.log('_____login data______')
            if (!user) {
                console.log('Invalid email')
            } else {
                easyPbkdf2.secureHash(req.body.password, user.salt, callback)
            }
        } else {
            console.log('Error : ' + err)
        }
    })
    callback = (err, passwordHash, originalSalt) => {
        User.findOne({ hashedPassword: passwordHash }).populate('mobileinfos').exec(function (err, user) {
            if (!err && user) {
                console.log(user)
                if (!isPresent(req.body.imei, user)) {
                    console.log('Not present')
                    Mobileinfo.create({ imei: req.body.imei, token: req.body.token }, (err, meta) => {
                        if (!err) {
                            user.mobileinfos.push(meta)
                            user.save((err, user) => {
                                if (!err) {
                                    console.log(user)
                                    console.log('New IMEI and token added')
                                } else {
                                    console.log('Save Error : ' + err)
                                }
                            })
                        } else {
                            console.log('Error : ' + err)
                        }
                    })

                } else {
                    console.log('present')
                }
            } else {
                console.log('Password Error : ' + err)
            }
        })
    }
})

function isPresent(imei, user) {
    var meta = user.mobileinfos
    for (i = 0; i < meta.length; i++) {
        if (meta[i].imei === imei) {
            return true
        }
    }
    return false
}
module.exports = router