var express = require('express')
var router = express.Router()
var bodyParser = require('body-parser');
var axios = require('axios');

router.use(bodyParser.urlencoded({ extended: true }))

router.post('/getLatLng',(req,res)=>{
    var data = req.body
    console.log(data)
    var reqBody = JSON.stringify({
        "cellTowers": [
            data
        ]
    })
    console.log(reqBody)
    axios.post('https://www.googleapis.com/geolocation/v1/geolocate?key=AIzaSyBBwph33rM5FjgIjYzp2L0pgaqCbWW9-Ts',{headers: {
        'Content-Type': 'application/json'
    }},reqBody)
    .then(r => {
        console.log(r.data)
        res.send(r.data.location)
    })
    .catch(err => {
        console.log(err)
    })

})

module.exports = router