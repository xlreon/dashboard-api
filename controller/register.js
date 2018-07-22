var express = require('express')
var router = express.Router();
var User = require('../models/user')
var Mobileinfo = require('../models/meta')
var easyPbkdf2 = require("easy-pbkdf2")()
var salt = easyPbkdf2.generateSalt();
var bodyParser = require("body-parser")

router.use(bodyParser.urlencoded({ extended: true }))

// register a new user
// recieves name, email,password,token,imei
router.post('/register', (req, res) => {

    var name = req.body.name
    var email = req.body.email
    var token = req.body.token
    var password = req.body.password
    var imei = req.body.imei
    var hashedPassword = password

    callback = (err, passwordHash, originalSalt) => {
        hashedPassword = passwordHash
        // console.log(name + "\n")
        // console.log(email + "\n")
        // console.log(token + "\n")
        // console.log(imei + "\n")
        // console.log(hashedPassword + "\n")
        Mobileinfo.create({ imei: req.body.imei, token: req.body.token }, (err, meta) => {
            if (!err) {
                var newUser = {
                    name: req.body.name,
                    email: req.body.email,
                    hashedPassword: hashedPassword,
                    salt: salt,
                    mobileinfos: meta
                }
                User.create(newUser, (err, user) => {
                    if (!err) {
                        console.log('______USER DATA_________')
                        console.log(user)
                    } else {
                        console.log('Error : ' + err)
                    }
                })
            } else {
                console.log('Info Error : ' + err)
            }
        })
    }

    easyPbkdf2.secureHash(password, salt, callback)
})

module.exports = router