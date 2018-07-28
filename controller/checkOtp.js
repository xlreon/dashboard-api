var express = require('express')
var router = express.Router()
var bodyParser = require("body-parser")

router.use(bodyParser.urlencoded({ extended: true }))

router.post('/checkOtp',(req,res) => {

    var response = {}

    if (req.body.otp == req.session.otp) {
        response = {
            status: 20,
            body: {
                info: "OTP verified successfully",
                error: false
            }
        }
        res.send(response)
    }
    else {
        response = {
            status: -20,
            body: {
                info: "OTP verification failed",
                error: true
            }
        }
        res.send(response)
    }
})

module.exports = router