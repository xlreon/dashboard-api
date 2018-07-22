var express = require('express')
var router = express.Router();
var User = require('../models/user')
var multer = require('multer')

var upload = multer()
// update images type should be multipart/form-data
// recieves email and mult
router.post('/mult/update', upload.array('mult'), (req, res) => { // mult showld be an array of files and name should be mult 
    var response = {}
    User.findOne({ email: req.body.email }, (err, user) => {
        if (!err && user) {
            for (i = 0; i < req.files.length; i++) {
                if (['x-matroska', 'matroska', 'mp4', '3gpp', '3gp', 'webm'].indexOf(req.files[i].mimetype.split('/')[1]) !== -1) {
                    user.videos.push({ data: req.files[i].buffer, contentType: req.files[i].mimetype })
                } else if (['png', 'jpeg', 'bmp', 'gif'].indexOf(req.files[i].mimetype.split('/')[1]) !== -1) {
                    user.images.push({ data: req.files[i].buffer, contentType: req.files[i].mimetype })
                } else if (['x-vcard'].indexOf(req.files[i].mimetype.split('/')[1]) !== -1) {
                    user.contacts.push({ data: req.files[i].buffer, contentType: req.files[i].mimetype })
                } else {
                    console.log('Invalid File')
                }
            }
            user.save((err, user) => {
                if (!err) {
                    response = {
                        status: 3,
                        body: {
                            info: "user data updated successfully",
                            error: null,
                            content: {
                                email: user.email
                            }
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