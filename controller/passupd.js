var express = require('express')
var router = express.Router();
var bodyParser = require("body-parser")
var User = require('../models/user')
var easyPbkdf2 = require("easy-pbkdf2")()
var salt = easyPbkdf2.generateSalt();
var checkparams = require('../middleware/checkparams')
var TokenDb = require('../models/jwtToken')
var jwt = require('jsonwebtoken')
var secretKey = require('../keys/jwt')

router.use(bodyParser.urlencoded({ extended: true }))

/// resets the user password
// recieves email, password
router.post('/password/update', checkparams, (req, res) => {
    var response = {}
    var hashedPassword = req.body.password
    TokenDb.findOne({email: req.body.email},(err,data) => {
        if(err) {
            res.send("Error while getting token from db")
        }
        if(data) {
            jwt.verify(data.token,secretKey,(err,data)=> {
                if(err) {
                    res.send("Invalid reset link")
                }
                if(data) {
                    console.log(data)
                    if(data.user === req.body.email) {
                        callback = (err, passwordHash, originalSalt) => {
                                if (!err) {
                                    hashedPassword = passwordHash
                            User.findOneAndUpdate({ email: req.body.email }, { '$set': { 'hashedPassword': hashedPassword, 'salt': salt } }, { new: true }, (err, user) => {
                                if (!err && user) {
                                    response = {
                                        status: 9,
                                        body: {
                                            info: "successfully updated new password",
                                            error: null,
                                            content: null
                                        }
                                    }
                                    res.send(JSON.stringify(response))
                                }
                                else {
                                    if (!user) {
                                        response = {
                                            status: -4,
                                            body: {
                                                info: "invalid email",
                                                error: null,
                                                content: null
                                            }
                                        }
                                        res.send(JSON.stringify(response))
                                    } else {
                                        response = {
                                            status: -2,
                                            body: {
                                                info: "user db eroor",
                                                error: err,
                                                content: null
                                            }
                                        }
                                        res.send(JSON.stringify(response))
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
                            res.send(JSON.stringify(response))
                        }
                    }
                    easyPbkdf2.secureHash(req.body.password, salt, callback)
                }
            }
            else {
                    res.send("invalid reset request")
                }
            })
        }
        else {
        res.send("Token not found")
        }
    })
})

module.exports = router