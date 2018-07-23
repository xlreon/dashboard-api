var express = require('express')
var router = express.Router();
var User = require('../models/user')
var multer = require('multer')
var AWS = require('aws-sdk')
var upload = multer()

var aws_access = require('../keys/configBucket.json')
var bucketName = require('../keys/bucketName.json')

// aws configuration
AWS.config.update(aws_access)
var s3 = new AWS.S3()
// update images type should be multipart/form-data
// recieves email and mult
router.post('/file/upload', upload.single('mult'), (req, res) => { // mult showld be a file and name should be mult 
    var response = {}
    var file, key, data_file
    User.findOne({ email: req.body.email }, (err, user) => {
        if (!err && user) {
            console.log(req.file)
            console.log('\n\n\n')

            if (isValideFile(req.file.mimetype)) {
                key = `${req.file.mimetype.split('/')[0]}/${Date.now().toString()}-${req.file.originalname}`
                file = {
                    Bucket: bucketName,
                    Body: req.file.buffer,
                    Key: key,
                    ContentType: req.file.mimetype
                }
                s3.upload(file, (err, data) => {
                    if (!err) {
                        data_file = { key: data.Key.split('/')[0], name: data.Key.split('/')[1], location: data.Location }
                        user.files.push(data_file)
                        user.save((err, user) => {
                            if (!err) {
                                response = {
                                    status: 7,
                                    body: {
                                        info: "user data uploaded and updated successfully",
                                        error: null,
                                        content: {
                                            key: data_file.key,
                                            name: data_file.name,
                                            location: data_file.location
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
                        console.log(err)
                        response = {
                            status: -11,
                            body: {
                                info: "aws s3 error",
                                error: err,
                                content: null
                            }
                        }
                        res.send(response)
                    }
                })
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

function isValideFile(file_type) {

    if (['x-matroska', 'matroska', 'mp4', '3gpp', '3gp', 'webm'].indexOf(file_type.split('/')[1]) !== -1
        || ['png', 'jpeg', 'bmp', 'gif'].indexOf(file_type.split('/')[1]) !== -1
        || ['x-vcard'].indexOf(file_type.split('/')[1]) !== -1) {
        return true
    } else {
        return false
    }
}

module.exports = router