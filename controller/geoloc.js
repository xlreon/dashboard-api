var express = require('express')
var router = express.Router();
var Mobileinfo = require('../models/meta')
var request = require('request')
var mapApi = require('../googlemap.json')
var bodyParser = require("body-parser")

router.use(bodyParser.urlencoded({ extended: true }))


// get location based on lat and lon
// recieves lat, lon, imei
router.post('/geoloc', (req, res) => {
    var loc = { lat: req.body.lat, lon: req.body.lon }
    var url = 'https://maps.googleapis.com/maps/api/geocode/json?latlng=' + loc.lat + ',' + loc.lon + '&key=' + mapApi
    var address
    Mobileinfo.findOne({ imei: req.body.imei }, (err, data) => {
        if (!err && data) {
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
        }
        else {
            console.log('Invalid IMEI')
            console.log('Error : ' + err)
        }
    })
})

module.exports = router
