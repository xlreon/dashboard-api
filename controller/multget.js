var express = require('express')
var router = express.Router()
var User = require('../models/user')
var bodyParser = require("body-parser")

router.use(bodyParser.urlencoded({ extended: true }))

// recieves email and type (images,videos,contacts)
router.post('/mult/get', (req, res) => {
    var response = {}
    User.findOne({ email: req.body.email }, (err, user) => {
        if (!err && user) {
            temp = user[req.body.type]
            if (temp) {
                response = {
                    status: 5,
                    body: {
                        info: "user data found successfully",
                        error: null,
                        content: {
                            data: temp,
                            type: req.body.type
                        }
                    }
                }
                res.send(JSON.stringify(response))
            } else {
                response = {
                    status: -8,
                    body: {
                        info: "user data empty",
                        error: null,
                        content: {
                            data: null,
                            type: req.body.type
                        }
                    }
                }
                res.send(JSON.stringify(response))
            }
        } else {
            if (!user) {
                response = {
                    status: -4,
                    body: {
                        info: "invalid email",
                        error: err,
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
})

module.exports = router