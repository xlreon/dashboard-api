var express = require('express')
var router = express.Router()
var User = require('../models/user')
var bodyParser = require("body-parser")

router.use(bodyParser.urlencoded({ extended: true }))
// gets the list of specific type file from db
// recieves email and type (images,videos,contacts)
router.post('/file/db/get', (req, res) => {
    var response = {}
    var data_file = []
    User.findOne({ email: req.body.email }, (err, user) => {
        if (!err && user) {
            for (i = 0; i < user.files.length; i++) {
                if (user.files[i].key === req.body.type) {
                    data_file.push(user.files[i])
                }
            }
            if (data_file.length != 0) {
                response = {
                    status: 5,
                    body: {
                        info: "user data found successfully in db",
                        error: null,
                        content: data_file
                    }
                }
                res.send(response)
            } else {
                response = {
                    status: -8,
                    body: {
                        info: "user data empty or invalid file type",
                        error: null,
                        content: null
                    }
                }
                res.send(response)
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
        }
    })
})

module.exports = router