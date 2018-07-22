var express = require('express')
var router = express.Router()
var serverKey = require('../serverKey.json')
var FCM = require('fcm-node')
var fcm = new FCM(serverKey)
var bodyParser = require("body-parser")

router.use(bodyParser.urlencoded({ extended: true }))

// testing to send notification
// recieves query as token
router.get("/test", (req, res) => {
    var response = {}
    console.log(req.query.token)

    var message = {
        to: req.query.token,
        notification: {
            title: "Test",
            body: "Test"
        }
    }

    fcm.send(message, (err, result) => {
        if (err) {
            console.log('Error : ' + err)
            response = {
                status: -1,
                body: {
                    info: 'Message not sent',
                    error: err,
                    content: null
                }
            }
            res.send(JSON.stringify(response))
        }
        else {
            console.log('Notidication sent to token id')
            response = {
                status: 1,
                body: {
                    info: 'Successfully sent',
                    error: null,
                    content: result
                }
            }
            res.send(JSON.stringify(response))
            console.log(JSON.parse(result).reults)
        }
    })
})

module.exports = router