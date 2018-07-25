var express = require('express')
var router = express.Router();
var User = require('../models/user')
var Mobileinfo = require('../models/mobileinfo')
var easyPbkdf2 = require("easy-pbkdf2")()
var salt = easyPbkdf2.generateSalt();
var bodyParser = require("body-parser")
var checkparams = require('../middleware/checkparams')

router.use(bodyParser.urlencoded({ extended: true }))

// register a new user
// recieves name, email,e_no(phone number),password,token,imei
router.post('/register', checkparams, (req, res) => {
    var response = {}
    var hashedPassword = req.body.password

    callback = (err, passwordHash, originalSalt) => {
        hashedPassword = passwordHash

        User.findOne({ email: req.body.email }, (err, userext) => {
            if (!err && userext) {
                // response = {
                //     status: 9,
                //     body: {
                //         info: "user exists",
                //         error: null,
                //         content: null
                //     }
                // }
                // res.send(response)
                Mobileinfo.findOne({ imei: req.body.imei }, (err, dataext) => {
                    if (!err && dataext) {
                        response = {
                            status: 9,
                            body: {
                                info: "user exists",
                                error: null,
                                content: null
                            }
                        }
                        res.send(response)
                    } else {
                        if (!dataext) {
                            Mobileinfo.create({ imei: req.body.imei, token: req.body.token }, (err, meta) => {
                                if (!err) {
                                    userext.mobileinfos.push(meta)
                                    userext.save((err, userext) => {
                                        if (!err) {
                                            console.log(userext)
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
            } else {
                if (!userext) {
                    Mobileinfo.create({ imei: req.body.imei, token: req.body.token }, (err, meta) => {
                        if (!err) {
                            var newUser = {
                                name: req.body.name,
                                email: req.body.email,
                                e_no: req.body.e_no,
                                hashedPassword: hashedPassword,
                                salt: salt,
                                mobileinfos: meta
                            }
                            User.create(newUser, (err, user) => {
                                if (!err) {
                                    console.log('______USER DATA_________')
                                    console.log(user)
                                    response = {
                                        status: 1,
                                        body: {
                                            info: "user successfully registered",
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
                        status: -2,
                        body: {
                            info: "user db eroor",
                            error: err,
                            content: null
                        }
                    }
                    res.send(response)
                }
            }
        })
    }

    easyPbkdf2.secureHash(req.body.password, salt, callback)
})

module.exports = router