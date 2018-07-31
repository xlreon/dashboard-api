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

var transporter = nodemailer.createTransport(sesTransport({
    accessKeyId: config.accessKeyId,
    secretAccessKey: config.secretAccessKey,
    sendingRate: 5
}));

router.use(bodyParser.urlencoded({ extended: true }))

var currentCode = -1;

router.post('/forgetPassword',(req,res) => {
var response = {}
    // req.session.passCode = Math.floor((Math.random() * 10000) + 1)
    req.session.passCode = md5(req.body.email)
    console.log(req.session.passCode)
    currentCode = req.session.passCode;
    var mailOptions = {
        from: config.email,
        to: req.body.email,
        subject: 'Verification of email',
        text: 'please verify your email',
        html: `<a href=${host_url}/reset/${req.session.passCode}><h1>Click here to reset your password</h1></a>`
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
            info: "Reset link sent",
            error: null,
            content: null
        }
    }
    res.send(response);
})


router.get('/reset/:id',(req,res) => {
    console.log(req.params.id,currentCode)
    if (req.params.id == currentCode) {
        console.log("Redirecting to update password page")
        res.writeHead(301,
            {Location: 'http://ec2-18-216-27-235.us-east-2.compute.amazonaws.com:3000/updatePass'}
        );
        res.end();
    }
    else {
        console.log("invalid reset link.")
    }
})

module.exports = router