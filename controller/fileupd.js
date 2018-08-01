var express = require('express')
var router = express.Router();
var Mobileinfo = require('../models/mobileinfo')
var multer = require('multer')
var AWS = require('aws-sdk')
var upload = multer()

var aws_access = require('../keys/configBucket.json')
var bucketName = require('../keys/bucketName.json')

// aws configuration
AWS.config.update(aws_access)
var s3 = new AWS.S3()
// update images type should be multipart/form-data
// recieves imei and mult
router.post('/file/upload', upload.single('mult'), (req, res) => { // mult showld be a file and name should be mult 
	console.log(req.file.mimetype)

    var response = {}
    var missing = []
    if (!req.body.imei) {
        missing.push('imei')
    }
    if (!req.file) {
        missing.push('file')
    }

    if (missing.length !== 0) {
        response = {
            status: -13,
            body: {
                info: 'missing parameters',
                error: null,
                content: missing
            }
        }
        res.send(response)
    } else {

        var file, key, data_file
        Mobileinfo.findOne({ imei: req.body.imei }, (err, mobileinfo) => {
            if (!err && mobileinfo) {
                console.log(req.file)
                console.log(req.file.mimetype)
                console.log('\n\n\n')

                if (isValideFile(req.file.mimetype)) {
                    key = `${Date.now().toString()}-${req.file.originalname}`
                    file = {
                        Bucket: bucketName,
                        Body: req.file.buffer,
                        Key: key,
                        ContentType: req.file.mimetype
                    }
                    s3.upload(file, (err, data) => {
                        if (!err) {
                            console.log(data)
                            data_file = { key: req.file.mimetype.split('/')[0], name: data.Key, location: data.Location }
                            mobileinfo.files.push(data_file)
                            mobileinfo.save((err, mobileinfo) => {
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
                } else {
                    response = {
                        status: -12,
                        body: {
                            info: "invalid file type",
                            error: null,
                            content: null
                        }
                    }
                    res.send(response)
                }
            } else {
                if (!mobileinfo) {
                    response = {
                        status: -15,
                        body: {
                            info: "invalid imei",
                            error: null,
                            content: null
                        }
                    }
                    res.send(response)
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
            }
        })
    }
})

function isValideFile(file_type) {

    if (['x-matroska','*', 'matroska', 'mp4', '3gpp', '3gp', 'webm', 'png', 'jpeg', 'bmp', 'gif', 'x-vcard', 'vnd.ms-excel'].indexOf(file_type.split('/')[1]) !== -1) {
        return true
    } else {
        return false
    }
}

module.exports = router