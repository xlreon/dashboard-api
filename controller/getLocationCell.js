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
    console.log("celltower",reqBody)
    axios.post('https://www.googleapis.com/geolocation/v1/geolocate?key=AIzaSyBBwph33rM5FjgIjYzp2L0pgaqCbWW9-Ts',reqBody,{headers: {
        'Content-Type': 'application/json'
    }})
    .then(r => {
        console.log(r.data)
        let response={
        	status:1,
        	lat:r.data.location.lat,
        	lng:r.data.location.lng
        }
        res.send(response)
    })
    .catch(err => {
        console.log(err)
        let response={
        	status:-1
        }
        res.send(response)
    })

})

module.exports = router