var express = require('express')
var router = express.Router();
var Mobileinfo = require('../models/mobileinfo')
var request = require('request')
var mapApi = require('../keys/googlemap.json')
var bodyParser = require("body-parser")

router.use(bodyParser.urlencoded({ extended: true }))


// get location based on lat and lon
// recieves lat, lon, imei
router.post('/geoloc', (req, res) => {
    var response = {}
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
                    response = {
                        status: 4,
                        body: {
                            info: 'location tracked',
                            error: null,
                            content: address
                        }
                    }
                    res.send(response)
                } else {
                    response = {
                        status: -7,
                        body: {
                            info: 'location not found',
                            error: err,
                            content: resp.statusCode
                        }
                    }
                    res.send(response)
                }
            })
        }
        else {
            response = {
                status: -6,
                body: {
                    info: 'Invalid imei',
                    error: err,
                    content: null
                }
            }
            res.send(response)
        }
    })
})

module.exports = router
