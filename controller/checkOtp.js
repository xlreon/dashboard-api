var express = require('express')
var router = express.Router()
var bodyParser = require("body-parser")
var User = require('../models/user')
var Mobileinfo = require('../models/mobileinfo')
var easyPbkdf2 = require("easy-pbkdf2")()
var salt = easyPbkdf2.generateSalt();
var EmailOtp = require('../models/emailOtp')


router.use(bodyParser.urlencoded({ extended: true }))

router.post('/checkOtp',(req,res) => {

    var response = {}
    var hashedPassword = req.body.password

callback = (err, passwordHash, originalSalt) => {
    if (!err) {
        hashedPassword = passwordHash
    var response = {}
    EmailOtp.findOne({email: req.body.email},(err,user)=> {
        if(err) {
            response = {
                status: -1,
                body: {
                    info: err
                }
            }
            res.send(JSON.stringify(response))
        }
        console.log(user)
        console.log(req.body.otp)
        if (user && req.body.otp === user.otp) {
            Mobileinfo.create({ imei: req.body.imei, token: req.body.token }, (err, meta) => {
                if (!err) {
                    var newUser = {
                        name: req.body.name,
                        email: req.body.email,
                        e_no: req.body.e_no,
                        hashedPassword: hashedPassword,
                        salt: salt,
                        tmpsalt: req.tmpsalt,
                        mobileinfos: meta
                    }
                    User.create(newUser, (err, user) => {
                        if (!err) {
                            console.log('______USER DATA_________')
                            console.log(user)
                            response = {
                                status: 1,
                                body: {
                                    otpVerified: true,
                                    info: "user successfully registered",
                                    error: null,
                                    content: null
                                }
                            }
                            res.send(JSON.stringify(response))
    
    
                        } else {
                            response = {
                                status: -2,
                                body: {
                                    otpVerified: true,
                                    info: "user db eroor",
                                    error: err,
                                    content: null
                                }
                            }
                            res.send(JSON.stringify(response))
                        }
                    })
                } else {
                    response = {
                        status: -3,
                        body: {
                            otpVerified: true,
                            info: "imei and token db eroor",
                            error: err,
                            content: null
                        }
                    }
                    res.send(JSON.stringify(response))
                }
            })
        }
        else {
            response = {
                status: -20,
                body: {
                    otpVerified: false,
                    info: "wrong otp entered or email not found",
                    error: true
                }
            }
            res.send(JSON.stringify(response))
        }
    })
}
    else {
        response = {
            status: -16,
            body: {
                info: "secure hashing error",
                error: err,
                content: null
            }
        }
        res.send(JSON.stringify(response))
    }
}

    easyPbkdf2.secureHash(req.body.password, salt, callback)
})

module.exports = router