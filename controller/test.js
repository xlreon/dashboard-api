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

    console.log(req.query.token)

    var message = {
        to: req.query.token,
        notification: {
            title: "Test",
            body: "Test"
        }

    }

    fcm.send(message, (err, response) => {
        if (err) {
            console.log('Error')
        }
        else {
            console.log('Notidication sent to token id')
            console.log(JSON.parse(response).results)
        }
    })
})

module.exports = router