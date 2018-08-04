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
router.post('/file/upload', upload.any('mult'), (req, res) => { // mult showld be a file and name should be mult 
	// console.log(req.files)
    var response = []

    var missing = []
    if (!req.body.imei) {
        missing.push('imei')
    }
    if (!req.files) {
        missing.push('files')
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
        res.send(JSON.stringify(response))
    } else {

        var file, key, data_file
        Mobileinfo.findOne({ imei: req.body.imei }, (err, mobileinfo) => {
            if (!err && mobileinfo) {
                req.files.map((file,index)=> {
                    var keyType = file.mimetype.split('/')[0]
                    if (isValideFile(file.mimetype)) {
                        key = `${Date.now().toString()}-${file.originalname}`
                        uploadFile = {
                            Bucket: `${bucketName}/${req.body.imei}`,
                            Body: file.buffer,
                            Key: key,
                            // ContentType: file.mimetype
                        }
                        s3.upload(uploadFile, (err, data) => {
                            if (!err) {
                                // console.log(data)
                                data_file = { key: keyType, name: data.Key, location: data.Location }
                                mobileinfo.files.push(data_file)
                                mobileinfo.save((err, mobileinfo) => {
                                    if (!err) {
                                        response.push({
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
                                        })
                                        index === req.files.length-1 ? res.send(JSON.stringify(response)) : console.log(response)
                                    } else {
                                        response.push({
                                            status: -3,
                                            body: {
                                                info: "imei and token db eroor",
                                                error: err,
                                                content: null
                                            }
                                        })
                                        index === req.files.length-1 ? res.send(JSON.stringify(response)) : console.log(response)
                                    }
                                })
                            } else {
                                console.log(err)
                                response.push({
                                    status: -11,
                                    body: {
                                        info: "aws s3 error",
                                        error: err,
                                        content: null
                                    }
                                })
                                index === req.files.length-1 ? res.send(JSON.stringify(response)) : console.log(response)
                            }
                        })
                    } else {
                        response.push({
                            status: -12,
                            body: {
                                info: "invalid file type",
                                error: null,
                                content: null
                            }
                        })
                        index === req.files.length-1 ? res.send(JSON.stringify(response)) : console.log(response)
                    }
                })
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
                    res.send(JSON.stringify(response))
                } else {
                    response = {
                        status: -3,
                        body: {
                            info: "imei and token db eroor",
                            error: err,
                            content: null
                        }
                    }
                    res.send(JSON.stringify(response))
                }
            }

        })
    }
})

function isValideFile(file_type) {

    if (['x-matroska','*', 'matroska', 'mp4', '3gpp', '3gp', 'webm', 'png', 'jpeg', 'bmp', 'gif', 'x-vcard', 'vnd.ms-excel'].indexOf(file_type.split('/')[1]) !== -1) {
        return true
    } else {
        return true
    }
}

module.exports = router