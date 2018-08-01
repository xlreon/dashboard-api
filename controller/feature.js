var express = require('express')
var router = express.Router()
var serverKey = require('../keys/serverKey.json')
var FCM = require('fcm-node')
var fcm = new FCM(serverKey)
var bodyParser = require("body-parser")
// var deviceToken = require('../keys/token.json')
var checkparams = require('../middleware/checkparams')
var MobileInfo = require('../models/mobileinfo')

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
    "lock": {
        "command": "lock"
    },
    "location": {
        "command": "location"
    },
    "info": {
        "command": "info"
    },
    "preventOn": {
        "command": "prevent",
        "action": "on"
    },
    "preventOff": {
        "command": "prevent",
        "action": "off"
    }
}



getCommand = (commandName, token) => {
    return {
        to: token,
        priority: "high",
        data: commands[commandName]
    }
}

// notification for feature
// recieves featureName
router.post("/feature", checkparams, (req, res) => {
    var response = {}
    var featureName = req.body.featureName
    if(req.body.imei !== undefined || req.body.imei !== null){

    var imei = req.body.imei
    var token = {}
    MobileInfo.findOne({imei: imei},(err,user) => {
        // console.log(user)
        if(user!==null) {
        token = user.token
        // console.log(token)
        console.log("Current feature -> ", featureName)
        var message = getCommand(featureName, token)
        console.log(message)
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
        }
    })
    }
    })
    
    router.post("/feature/setRemotePassword",(req,res) => {
        var response = {}
        if(req.body.imei !== undefined || req.body.imei !== null){
        var imei = req.body.imei
        var password = req.body.password
        var message = req.body.message
        var phone = req.body.phone
        var token = {}
        console.log("Current feature -> set remote password")

        MobileInfo.findOne({imei: imei},(err,user)=>{
            if(user!==null) {
            token = user.token
                if (message || phone)
                    {    
                    // console.log(token)
                // console.log(user)
                    var fcmMessage = {
                        to: token,
                        priority: "high",
                    data: {
                        "command": "password",
                        "pass": password,
                        "custom": "true", // true or false depending on the message
                        "message": message, // optional
                        "phone": phone // optional
                    }
                }
                // console.log("true block")
                }
                else {
                    var fcmMessage = {
                        to: token,
                        priority: "high",
                        data: {
                            "command": "password",
                            "pass": password,
                            "custome": "false"
                        }
                    }
                    // console.log("false block")
                }
                console.log(fcmMessage)
                fcm.send(fcmMessage, (err, result) => {
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
            }
    })
    }
})

module.exports = router