var express = require('express')
var FCM = require('fcm-node')
var serverKey = require('./serverKey.json')
var fcm = new FCM(serverKey)
var easyPbkdf2 = require("easy-pbkdf2")();
var salt = easyPbkdf2.generateSalt();
var bodyParser = require("body-parser");
var deviceToken = require('./token.json')
var mapApi = require('./googlemap.json')
var mongoose = require('mongoose')
var User = require('./models/user.js')
var Mobileinfo = require('./models/meta.js')
var request = require('request')

var app = express()

mongoose.connect('mongodb://localhost:27017/dashboard', { useNewUrlParser: true })

app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json())

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

        Mobileinfo.create({ imei: req.body.imei, token: req.body.token }, (err, meta) => {
            if (!err) {
                var newUser = {
                    name: req.body.name,
                    email: req.body.email,
                    hashedPassword: hashedPassword,
                    salt: salt,
                    mobileinfos: meta
                }
                User.create(newUser, (err, user) => {
                    if (!err) {
                        console.log('______USER DATA_________')
                        console.log(user)
                    } else {
                        console.log('Error : ' + err)
                    }
                })
            } else {
                console.log('Info Error : ' + err)
            }
        })
    }

    easyPbkdf2.secureHash(password, salt, callback)
})

app.post('/login', (req, res) => {
    // var email = req.body.email
    // var password = req.body.password
    // var imei = req.body.imei
    // var hashedPassword = password

    User.findOne({ email: req.body.email }, (err, user) => {
        if (!err) {
            console.log('_____login data______')
            if (!user) {
                console.log('Invalid email')
            } else {
                easyPbkdf2.secureHash(req.body.password, user.salt, callback)
            }
        } else {
            console.log('Error : ' + err)
        }
    })
    callback = (err, passwordHash, originalSalt) => {
        User.findOne({ hashedPassword: passwordHash }).populate('mobileinfos').exec(function (err, user) {
            if (!err && user) {
                console.log(user)
                if (!isPresent(req.body.imei, user)) {
                    console.log('Not present')
                    Mobileinfo.create({ imei: req.body.imei, token: req.body.token }, (err, meta) => {
                        if (!err) {
                            user.mobileinfos.push(meta)
                            user.save((err, user) => {
                                if (!err) {
                                    console.log(user)
                                    console.log('New IMEI and token added')
                                } else {
                                    console.log('Save Error : ' + err)
                                }
                            })
                        } else {
                            console.log('Error : ' + err)
                        }
                    })

                } else {
                    console.log('present')
                }
            } else {
                console.log('Password Error : ' + err)
            }
        })
    }
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
        data: commands[commandName],
        notification: {
            title: commandName,
            body: commands[commandName]
        }
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
            console.log('Notification sent to token id')
            console.log(JSON.parse(response))
        }
    })
})

app.post('/geoloc', (req, res) => {
    var loc = { lat: req.body.lat, lon: req.body.lon }
    var url = 'https://maps.googleapis.com/maps/api/geocode/json?latlng=' + loc.lat + ',' + loc.lon + '&key=' + mapApi
    var address
    request(url, (err, resp, body) => {
        if (!err && resp.statusCode == 200) {
            var address = []
            JSON.parse(body).results.forEach((item) => {
                address.push({ formatted_address: item.formatted_address, location_type: item.geometry.location_type })
            })
            console.log(address)
        } else {
            console.log('Location Error \n')
            console.log(err)
            console.log(resp.statusCode)
        }
    })
})

app.post('/token/update', (req, res) => {
    Mobileinfo.findOneAndUpdate({ imei: req.body.imei }, { '$set': { 'token': req.body.token } }, { new: true }, (err, data) => {
        if (!err && data) {
            console.log('Saved Successfully')
            console.log(data)
        } else {
            console.log('Save Error : ' + err)
        }
    })
})

app.post('/phone/set', (req, res) => {
    // console.log(req.body.specs)
    device_data = req.body.specs
    Mobileinfo.findOneAndUpdate({ imei: req.body.imei }, { '$set': { 'device': device_data } }, { new: true }, (err, data) => {
        if (!err && data) {
            console.log(data)
        } else {
            console.log('Invalid IMEI')
            console.log('Error : ' + err)
        }
    })
})

app.post('/phone/get', (req, res) => {
    Mobileinfo.findOne({ imei: req.body.imei }, (err, data) => {
        if (!err && data) {
            console.log(data.device)
        } else {
            console.log('No such device')
            console.log('Error : ' + err)
        }
    })
})

app.listen("8080")

function isPresent(imei, user) {
    var meta = user.mobileinfos
    for (i = 0; i < meta.length; i++) {
        if (meta[i].imei === imei) {
            return true
        }
    }
    return false
}