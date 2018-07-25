var express = require('express')
var router = express.Router();
var AWS = require('aws-sdk')
var bodyParser = require("body-parser")
var checkparams = require('../middleware/checkparams')

router.use(bodyParser.urlencoded({ extended: true }))

var aws_access = require('../keys/configBucket.json')
var bucketName = require('../keys/bucketName.json')

// aws configuration
AWS.config.update(aws_access)
var s3 = new AWS.S3()
// downloads data from aws cloud
// recieves name (of db file)
router.post('/file/get', checkparams, (req, res) => {
    s3.getObject({ Bucket: bucketName, Key: `${req.body.name}` }, (err, file) => {
        if (!err && file) {
            response = {
                status: 8,
                body: {
                    info: "user data downloaded successfully from aws s3",
                    error: null,
                    content: file
                }
            }
            res.send(response)
        } else {
            if (!file) {
                response = {
                    status: -14,
                    body: {
                        info: "aws s3 file not found",
                        error: null,
                        content: null
                    }
                }
                res.send(response)
            } else {
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
        }
    })
})

module.exports = router