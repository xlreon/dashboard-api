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
    var response = {}
    var hashedPassword = req.body.password

    callback = (err, passwordHash, originalSalt) => {
        hashedPassword = passwordHash
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
    }

    easyPbkdf2.secureHash(password, salt, callback)
})

module.exports = router