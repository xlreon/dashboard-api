var express = require('express')
var FCM = require('fcm-node')
var serverKey = require('./serverKey.json')
var fcm = new FCM(serverKey)
var easyPbkdf2 = require("easy-pbkdf2")();
var salt = easyPbkdf2.generateSalt();
var bodyParser = require("body-parser");
var deviceToken = require('./token.json')
var mongoose = require('mongoose')
var User = require('./models/user.js')

var app = express()

mongoose.connect('mongodb://localhost:27017/dashboard', { useNewUrlParser: true })

app.use(bodyParser.urlencoded({
    extended: true
}));

app.get('/', (req, res) => {
    res.send('hello world')

})

app.get("/test", (req, res) => {

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

app.post('/register', (req, res) => {

    var name = req.body.name
    var email = req.body.email
    var token = req.body.token
    var password = req.body.password
    var imei = req.body.imei
    var hashedPassword = password

    callback = (err, passwordHash, originalSalt) => {
        hashedPassword = passwordHash
        // console.log(name + "\n")
        // console.log(email + "\n")
        // console.log(token + "\n")
        // console.log(imei + "\n")
        // console.log(hashedPassword + "\n")
        var newUser = {
            name: req.body.name,
            email: req.body.email,
            token: req.body.token,
            imei: req.body.imei,
            hashedPassword: hashedPassword
        }

        User.create(newUser, (err, users) => {
            if (!err) {
                console.log('______USER DATA_________')
                console.log(users)
            } else {
                console.log('Error : ' + err)
            }
        })
    }

    easyPbkdf2.secureHash(password, salt, callback)
})

app.post('/login', (req, res) => {
    var email = req.body.email
    var password = req.body.password
    var imei = req.body.imei
    var hashedPassword = password

    callback = (err, passwordHash, originalSalt) => {
        hashedPassword = passwordHash
        // console.log(email + "\n")
        // console.log(password + "\n")
        // console.log(imei + "\n")
        // console.log(hashedPassword + "\n")

        User.findOne({ email: req.body.email, hashedPassword: hashedPassword }, (err, users) => {
            if (!err) {
                console.log('_____login data______')
                if (users) {
                    console.log(users)
                } else {
                    console.log('Invalid Cridentials')
                }
            } else {
                console.log('Error : ' + err)
            }
        })
    }

    easyPbkdf2.secureHash(password, salt, callback)
})

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
        data: commands[commandName]
    }
}

app.post("/feature", (req, res) => {
    var featureName = req.body.featureName
    console.log("Current feature -> ", featureName)
    var message = getCommand(featureName, deviceToken)
    fcm.send(message, (err, response) => {
        if (err) {
            console.log('Error')
        }
        else {
            console.log('Notidication sent to token id')
            console.log(JSON.parse(response))
        }
    })
})

app.listen("8080")