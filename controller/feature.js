var express = require('express')
var router = express.Router()
var serverKey = require('../keys/serverKey.json')
var FCM = require('fcm-node')
var fcm = new FCM(serverKey)
var bodyParser = require("body-parser")
var deviceToken = require('../keys/token.json')
var checkparams = require('../middleware/checkparams')

router.use(bodyParser.urlencoded({ extended: true }))

var commands = {
    "wipe": {
        "command": "wipe"
    },
    "alarmOn": {
        "command": "alarm",
        "action": "on"
    },
    "alarmOff": {
        "command": "alarm",
        "action": "off"
    },
    "setRemotePassword": {
        "command": "password",
        "pass": "1234",
        "custom": "true", // true or false depending on the message
        "message": "This phone is lost", // optional
        "phone": "9090909090" // optional
    },
    "lock": {
        "command": "lock"
    },
    "location": {
        "command": "location"
    }
}



getCommand = (commandName, token) => {
    return {
        to: token,
        priority: "high",
        data: commands[commandName],
        notification: {
            title: commandName,
            body: commands[commandName]
        }
    }
}

// notification for feature
// recieves featureName
router.post("/feature", checkparams, (req, res) => {
    var response = {}
    var featureName = req.body.featureName
    console.log("Current feature -> ", featureName)
    var message = getCommand(featureName, deviceToken)
    fcm.send(message, (err, result) => {
        if (err) {
            response = {
                status: -1,
                body: {
                    info: 'Message not sent',
                    error: err,
                    content: null
                }
            }
            res.send(response)
        }
        else {
            console.log('Notification sent to token id')
            response = {
                status: 1,
                body: {
                    info: 'Successfully sent',
                    error: null,
                    content: result
                }
            }
            res.send(response)
        }
    })
})

module.exports = router