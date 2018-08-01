var express = require('express')
var router = express.Router();
var EmailOtp = require('../models/emailOtp')
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
            var otp = Math.floor((Math.random() * 10000) + 1000)
            var mailOptions = {
                from: config.email,
                to: req.body.email,
                subject: 'Verification of email',
                text: 'please verify your email',
                html: `<h1>${otp} is your OTP</h1>`
            };

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
                        // console.log(req.session.otp)
                        EmailOtp.findOne({email: req.body.email},(err,user) => {
                            if(user) {
                                EmailOtp.findOneAndUpdate({email: user.email},{'$set': {'otp': otp}},(err,user)=>{
                                    if(user) {
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
                                    }
                                    else {
                                        reponse = {
                                            status: -1,
                                            body: {
                                                info: "error generating otp for email",
                                                description: "Error creating Email otp db"
                                            }
                                        }
                                    }                                    
                                })
                            }
                            else {
                                EmailOtp.create({email: req.body.email, otp: otp},(err,user) => {
                                    console.log(user)
                                    if(user) {
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
                                }
                                else {
                                    reponse = {
                                        status: -1,
                                        body: {
                                            info: "error generating otp for email",
                                            description: "Error creating Email otp db"
                                        }
                                    }
                                }
                                })
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