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
    var response = {}
    User.findOne({ email: req.body.email }, (err, user) => {
        if (!err) {
            console.log('_____login data______')
            if (!user) {
                response = {
                    status: -4,
                    body: {
                        info: "invalid email",
                        error: err,
                        content: null
                    }
                }
                res.send(response)
            } else {
                easyPbkdf2.secureHash(req.body.password, user.salt, callback)
            }
        } else {
            response = {
                status: -2,
                body: {
                    info: "user db eroor",
                    error: err,
                    content: null
                }
            }
            res.send(response)
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
                                    response = {
                                        status: 2,
                                        body: {
                                            info: "New IMEI and token added",
                                            error: null,
                                            content: null
                                        }
                                    }
                                    res.send(response)
                                } else {
                                    response = {
                                        status: -2,
                                        body: {
                                            info: "user db eroor",
                                            error: err,
                                            content: null
                                        }
                                    }
                                    res.send(response)
                                }
                            })
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
                    })

                } else {
                    response = {
                        status: 3,
                        body: {
                            info: "user logged in successfully",
                            error: null,
                            content: {
                                email: user.email
                            }
                        }
                    }
                    res.send(response)
                }
            } else {
                response = {
                    status: -5,
                    body: {
                        info: "invalid password",
                        error: err,
                        content: null
                    }
                }
                res.send(response)
            }
        })
    }
})

function isPresent(imei, user) {
    var meta = user.mobileinfos

    for (i = 0; i < meta.length; i++) {
        if (meta[i].imei === Number(imei)) {
            return true
        }
    }
    return false
}
module.exports = router