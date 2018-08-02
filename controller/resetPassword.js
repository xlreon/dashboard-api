var express = require('express');
var router = express.Router()
var bodyParser = require('body-parser');
var nodemailer = require('nodemailer')
var easyPbkdf2 = require("easy-pbkdf2")()
var sesTransport = require('nodemailer-ses-transport')
var tmpsalt = easyPbkdf2.generateSalt()
var config = require('../keys/configBucket.json')
var host_url = 'http://ec2-18-216-27-235.us-east-2.compute.amazonaws.com:8080'
var md5 = require('md5');
var User = require('../models/user');
var jwt = require('jsonwebtoken');
var secretKey = require('../keys/jwt')
var TokenDb = require('../models/jwtToken');

var transporter = nodemailer.createTransport(sesTransport({
    accessKeyId: config.accessKeyId,
    secretAccessKey: config.secretAccessKey,
    sendingRate: 5
}));

router.use(bodyParser.urlencoded({ extended: true }))

var currentCode = -1;

router.post('/forgetPassword',(req,res) => {
var response = {}
var mailOptions = {}
    // req.session.passCode = Math.floor(Math.random() * (999999 - 100000 + 1)) + 100000
    // console.log(req.session.passCode)
    currentCode = req.session.passCode;

    if(req.body.email) {
        
        User.findOne({email: req.body.email}, (err,user) => {

            // console.log(user)
            if(err) {
                response = {
                    status: -2,
                    body: {
                        info: err
                    }
                }
                res.send(JSON.stringify(response));
            }
            else if (!user) {
                response = {
                    status: -3,
                    body: {
                        info: "Email not found in database"
                    }
                }
                res.send(JSON.stringify(response));
            }
            else {
                var configToken = {
                    email: user.email,
                    key: Math.floor(Math.random() * (999999 - 100000 + 1)) + 100000
                }
            jwt.sign({user: configToken},secretKey,{expiresIn: '1h'},(err,token) => {
                if(err) {
                    res.send("Token creation error.")
                }
                console.log(token)
                if(token) {
                    TokenDb.findOne({email: user.email},(err,result) => {
                        if(err) {
                            res.send('db error')
                        }
                        if(result) {
                            TokenDb.findOneAndUpdate({email: user.email},{'$set': {token: token}},(err,newResult) => {
                                // console.log(data)
                                mailOptions = {
                                    from: config.email,
                                    to: user.email,
                                    subject: 'Reset Password',
                                    text: 'please click on the link to reset your password',
                                    html: `<a href=${host_url}/reset/${token}><h1>Click here to reset your password</h1></a>`
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
                                        res.send(JSON.stringify(response))
                                    } else {
                                        console.log('Email sent: ' + info.envelope.to[0]);
                                        req.tmpsalt = tmpsalt
                                    }
                                });
                                response = {
                                    status: 1,
                                    body: {
                                        info: "Reset link sent",
                                        error: null,
                                        content: null
                                    }
                                }
                                res.send(JSON.stringify(response));
                            })
                        }
                        else {
                            TokenDb.create({email: user.email,token: token},(err,data)=> {
                                if(err) {
                                    res.send("Db error")
                                }
                                if(data) {
                                    // console.log(data)
                                    mailOptions = {
                                        from: config.email,
                                        to: user.email,
                                        subject: 'Reset Password',
                                        text: 'please click on the link to reset your password',
                                        html: `<a href=${host_url}/reset/${token}><h1>Click here to reset your password</h1></a>`
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
                                            res.send(JSON.stringify(response))
                                        } else {
                                            console.log('Email sent: ' + info.envelope.to[0]);
                                            req.tmpsalt = tmpsalt
                                        }
                                    });
                                    response = {
                                        status: 1,
                                        body: {
                                            info: "Reset link sent",
                                            error: null,
                                            content: null
                                        }
                                    }
                                    res.send(JSON.stringify(response));
                                }
                            })
                        }
                    })
                }
            })
            }
        })
    }
    else {
        response = {
            status: -1,
            body: {
                info: "Email address is blank"
            }
        }
        res.send(JSON.stringify(response));
    }
})


router.get('/reset/:id',(req,res) => {
    jwt.verify(req.params.id,secretKey,(err,data)=> {
        if(err) {
            res.send("Invalid reset link")
        }
        if(data) {
            console.log("Redirecting to update password page")
            res.writeHead(301,
                {Location: 'http://ec2-18-216-27-235.us-east-2.compute.amazonaws.com:3000/updatePass'}
            );
            res.end();
        }
    })
})

module.exports = router