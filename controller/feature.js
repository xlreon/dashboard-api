var express = require('express')
var router = express.Router()
var serverKey = require('../serverKey.json')
var FCM = require('fcm-node')
var fcm = new FCM(serverKey)
var bodyParser = require("body-parser")
var deviceToken = require('../token.json')

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
router.post("/feature", (req, res) => {
    var featureName = req.body.featureName
    console.log("Current feature -> ", featureName)
    var message = getCommand(featureName, deviceToken)
    fcm.send(message, (err, response) => {
        if (err) {
            console.log('Error')
        }
        else {
            console.log('Notification sent to token id')
            console.log(JSON.parse(response))
        }
    })
})

module.exports = router