var  express = require('express')
var FCM = require('fcm-node')
var serverKey = "AAAAtq-PMqs:APA91bEgY4eGZZU5vf8cTFRkiUUnnAq7sRL9owz8170x-tuv8-cSxQKQ3RPc0aIsdMal5H_yKABZVcl681hN_oSs_k6YpXncRnsltUxoKgtBZAZmtEqtAzBt-RCFLzywPn-SusLlAD0hsnYR4vmGP8tG3rbuq-EETw"
var fcm = new FCM(serverKey)
var easyPbkdf2 = require("easy-pbkdf2")();
var salt = easyPbkdf2.generateSalt();
var bodyParser = require("body-parser");


var app = express()

app.use(bodyParser.urlencoded({
    extended: true
 }));
//  app.use(bodyParser.json());

app.get('/',(req,res) => {
    res.send('hello world')

})

app.get("/test",(req,res) => {

    console.log(req.query.token)

    var message = {
        // to: 'cIRJQ-uhjFw:APA91bEQF6o29nvidjgLZmprBcNN-VTS9woYWyAZeQ7bgY7AKQHTjBCptk3yacK-phTp4_VXtwULRUvosWSRy03wT7uv2lB6mm0N_Sv4je7S3b9br3YQdi5DW4nND5gbvfDjY6vvTwQcWuU5j9Y2c2qFCfNieg6FpQ',
        to: req.query.token,
        // message_id: "ajsdhak",
        // priority: "high",
        // data: {
        //     command: "gps"
        // }, 
        notification: {
            title: "Test",
            body: "Test"
        }

    }

    fcm.send(message, (err,response) => {
        if(err) {
            console.log('Error')
        }
        else {
            console.log('Notidication sent to token id')
            console.log(JSON.parse(response).results)
        }
    })
})

app.post('/register',(req,res)=>{
    
    var name = req.body.name
    var email = req.body.email
    var token = req.body.token
    var password = req.body.password
    var imei = req.body.imei
    var hashedPassword = password
    // var password = "abcd"
    
    
    callback = ( err, passwordHash, originalSalt ) => { 
        hashedPassword=passwordHash
        console.log(name+"\n")
        console.log(email+"\n")
        console.log(token+"\n")
        console.log(imei+"\n")
        console.log(hashedPassword+"\n")
    }
    
    easyPbkdf2.secureHash( password, salt, callback)
})

app.post('/login',(req,res)=> {
    var email = req.body.email
    var password = req.body.password
    var imei = req.body.imei
    var hashedPassword = password

    callback = (err, passwordHash, originalSalt ) => {
        hashedPassword = passwordHash
        console.log(email+"\n")
        console.log(password+"\n")
        console.log(imei+"\n")
        console.log(hashedPassword+"\n")
    }

    easyPbkdf2.secureHash(password, salt, callback)
})

app.listen("8080")