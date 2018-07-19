var  express = require('express')
var FCM = require('fcm-node')
var serverKey = "AAAAtq-PMqs:APA91bEgY4eGZZU5vf8cTFRkiUUnnAq7sRL9owz8170x-tuv8-cSxQKQ3RPc0aIsdMal5H_yKABZVcl681hN_oSs_k6YpXncRnsltUxoKgtBZAZmtEqtAzBt-RCFLzywPn-SusLlAD0hsnYR4vmGP8tG3rbuq-EETw"
var fcm = new FCM(serverKey)
var easyPbkdf2 = require("easy-pbkdf2")();
var salt = easyPbkdf2.generateSalt();



var app = express()

var message = {
    to: 'cIRJQ-uhjFw:APA91bEQF6o29nvidjgLZmprBcNN-VTS9woYWyAZeQ7bgY7AKQHTjBCptk3yacK-phTp4_VXtwULRUvosWSRy03wT7uv2lB6mm0N_Sv4je7S3b9br3YQdi5DW4nND5gbvfDjY6vvTwQcWuU5j9Y2c2qFCfNieg6FpQ',
    notification: {
        title: "Test",
        body: "Test"
    }
}

app.get('/',(req,res) => {
    res.send('hello world')
    fcm.send(message, (err,response) => {
        if(err) {
            console.log('Error')
        }
        else {
            console.log('success')
            console.log(response)
        }
    })
})

app.post('/register',(req,res)=>{
    
    console.log(req);
    
    // var name = req.name
    // // var email = req.email
    // var token = req.token
    // var password = req.password
    // var imei = req.imei
    // var password = "abcd"

    // console.log(name+"\n")
    // console.log(email+"\n")
    // console.log(token+"\n")
    // console.log(imei+"\n")

    easyPbkdf2.secureHash( password, salt, function( err, passwordHash, originalSalt ) { 
        console.log(passwordHash)
    })

})

app.listen("5050")