var express = require('express')
var router = express.Router();
var User = require('../models/user')
var Mobileinfo = require('../models/mobileinfo')
var easyPbkdf2 = require("easy-pbkdf2")()
var salt = easyPbkdf2.generateSalt();
var bodyParser = require("body-parser")
var checkparams = require('../middleware/checkparams')

router.use(bodyParser.urlencoded({ extended: true }))

// user login
// recieves email,password
router.post('/loginWeb', checkparams, (req, res) => {
    // var email = req.body.email
    // var password = req.body.password
    // var imei = req.body.imei
    // var hashedPassword = password
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
        if (!err) {
            User.findOne({ hashedPassword: passwordHash } , (err, user) => {
                if (!err && user) {
                    console.log(user)
                    // if (user.verified) {
                        
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
                        
                    // } else {
                    //     response = {
                    //         status: -19,
                    //         body: {
                    //             info: "user not verified",
                    //             error: null,
                    //             content: {
                    //                 email: user.email
                    //             }
                    //         }
                    //     }
                    //     res.send(response)
                    // }
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
        } else {
            response = {
                status: -16,
                body: {
                    info: "secure hashing error",
                    error: err,
                    content: null
                }
            }
            res.send(response)
        }
    }
})

module.exports = router