var express = require('express')
var router = express.Router();
var User = require('../models/user')
var Mobileinfo = require('../models/mobileinfo')
var easyPbkdf2 = require("easy-pbkdf2")()
var salt = easyPbkdf2.generateSalt();
var bodyParser = require("body-parser")
var checkparams = require('../middleware/checkparams')
var mailware = require('../middleware/mailware')
var mail_sent = false
var nodemailer = require('nodemailer')
var sesTransport = require('nodemailer-ses-transport')
var tmpsalt = easyPbkdf2.generateSalt()
var config = require('../keys/configBucket.json')

router.use(bodyParser.urlencoded({ extended: true }))
// storeSession();

var transporter = nodemailer.createTransport(sesTransport({
    accessKeyId: config.accessKeyId,
    secretAccessKey: config.secretAccessKey,
    sendingRate: 5
}));


// register a new user
// recieves name, email,e_no(phone number),password,token,imei
router.post('/register', checkparams, (req, res) => {
    var response = {}
    var hashedPassword = req.body.password

    callback = (err, passwordHash, originalSalt) => {
        if (!err) {
            hashedPassword = passwordHash

            User.findOne({ email: req.body.email }, (err, userext) => {
                if (!err && userext) {
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
                    if (!userext) {
                        req.session.otp = Math.floor((Math.random() * 10000) + 1)
                        console.log(req.session.otp)
                        var mailOptions = {
                            from: config.email,
                            to: req.body.email,
                            subject: 'Verification of email',
                            text: 'please verify your email',
                            html: `<h1>${req.session.otp} is your OTP</h1>`
                        };
                        transporter.sendMail(mailOptions, function (err, info) {
                            if (err) {
                                response = {
                                    status: -17,
                                    body: {
                                        info: "nodemailer smtp error",
                                        error: err,
                                        content: null
                                    }
                                }
                                res.send(response)
                            } else {
                                console.log('Email sent: ' + info.envelope.to[0]);
                                req.tmpsalt = tmpsalt
                            }
                        });
                        response = {
                            status: 1,
                            body: {
                                info: "OTP Sent successfully",
                                error: null,
                                content: null
                            }
                        }
                        res.send(response);
                        // Mobileinfo.create({ imei: req.body.imei, token: req.body.token }, (err, meta) => {
                        //     if (!err) {
                        //         var newUser = {
                        //             name: req.body.name,
                        //             email: req.body.email,
                        //             e_no: req.body.e_no,
                        //             hashedPassword: hashedPassword,
                        //             salt: salt,
                        //             tmpsalt: req.tmpsalt,
                        //             mobileinfos: meta
                        //         }
                                // User.create(newUser, (err, user) => {
                                //     if (!err) {
                                //         console.log('______USER DATA_________')
                                //         console.log(user)
                                //         response = {
                                //             status: 1,
                                //             body: {
                                //                 info: "user successfully registered",
                                //                 error: null,
                                //                 content: null
                                //             }
                                //         }
                                //         res.send(response)


                                //     } else {
                                //         response = {
                                //             status: -2,
                                //             body: {
                                //                 info: "user db eroor",
                                //                 error: err,
                                //                 content: null
                                //             }
                                //         }
                                //         res.send(response)
                                //     }
                                // })
                        //     } else {
                        //         response = {
                        //             status: -3,
                        //             body: {
                        //                 info: "imei and token db eroor",
                        //                 error: err,
                        //                 content: null
                        //             }
                        //         }
                        //         res.send(response)
                        //     }
                        // })
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

    easyPbkdf2.secureHash(req.body.password, salt, callback)
})


module.exports = router