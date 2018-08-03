var nodemailer = require('nodemailer')
var sesTransport = require('nodemailer-ses-transport')
var host_url = 'http://ec2-18-220-150-205.us-east-2.compute.amazonaws.com:8080/'
var easyPbkdf2 = require("easy-pbkdf2")()
var tmpsalt = easyPbkdf2.generateSalt()
var config = require('../keys/configBucket.json')

function mailware(req, res, next) {
    var transporter = nodemailer.createTransport(sesTransport({
        accessKeyId: config.accessKeyId,
        secretAccessKey: config.secretAccessKey,
        sendingRate: 5
    }));

    var mailOptions = {
        from: config.email,
        to: req.body.email,
        subject: 'Verification of email',
        text: 'please verify your email',
        html: `<h1>${host_url}/${tmpsalt}</h1> <br> <h2>Copy the above link and open in new tab to verify</h2>`
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
            console.log('Email sent: ' + info.response);
            req.tmpsalt = tmpsalt
            next()
        }
    });
}

module.exports = mailware