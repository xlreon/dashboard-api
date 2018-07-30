function checkparams(req, res, next) { //req.route.path
    var missing = []
    switch (req.route.path) {
        case '/register':
            if (!req.body.name) { missing.push('name') }
            if (!req.body.email) { missing.push('email') }
            if (!req.body.e_no) { missing.push('e_no') }
            if (!req.body.password) { missing.push('password') }
            if (!req.body.imei) { missing.push('imei') }
            if (!req.body.token) { missing.push('token') }
            break
        case '/login':
            if (!req.body.email) { missing.push('email') }
            if (!req.body.password) { missing.push('password') }
            if (!req.body.imei) { missing.push('imei') }
            if (!req.body.token) { missing.push('token') }
            break
        case '/loginWeb':
            if (!req.body.email) { missing.push('email') }
            if (!req.body.password) { missing.push('password') }
            break
        case '/phone/get':
            if (!req.body.imei) { missing.push('imei') }
            break
        case '/phone/set':
            if (!req.body.imei) { missing.push('imei') }
            if (!req.body.ssid) { missing.push('ssid') }
            if (!req.body.battery) { missing.push('battery') }
            if (!req.body.brand) { missing.push('brand') }
            if (!req.body.model) { missing.push('model') }
            if (!req.body.gps) { missing.push('gps') }
            if (!req.body.data) { missing.push('data') }
            var dat = JSON.parse(req.body.data)
            if (dat === {}){
                console.log("data not empty")
                if(req.body.gps === "true") {
                    if (!dat.lat) { missing.push('latitude') }
                    if (!dat.lng) { missing.push('longitude') }
                }
                else {
                    // if(dat!=={}){
                        if (!dat.cellId) { missing.push('cellId') }
                        if (!dat.locationAreaCode) { missing.push('locationAreaCode') }
                        if (!dat.mobileCountryCode) { missing.push('mobileCountryCode') }
                        if (!dat.mobileNetworkCode) { missing.push('mobileNetworkCode') }
                    // }
                }
            }
            break
        case '/file/get':
            if (!req.body.name) { missing.push('name') }
            break
        case '/file/db/get':
            if (!req.body.imei) { missing.push('imei') }
            if (!req.body.type) { missing.push('type') }
            break
        case '/feature':
            if (!req.body.featureName) { missing.push('featureName') }
            break
        case '/geoloc':
            if (!req.body.lat) { missing.push('lat') }
            if (!req.body.lng) { missing.push('lng') }
            // if (!req.body.imei) { missing.push('imei') }
            break
        case '/token/update':
            if (!req.body.imei) { missing.push('imei') }
            if (!req.body.token) { missing.push('token') }
            break
        case '/imei/get':
            if (!req.body.email) { missing.push('email') }
            break
        case '/password/update':
            if (!req.body.email) { missing.push('email') }
            if (!req.body.password) { missing.push('password') }
            break
        default: break
    }

    if (missing.length === 0) {
        return next()
    }

    var response = {
        status: -13,
        body: {
            info: 'missing parameters',
            error: null,
            content: missing
        }
    }

    res.send(response)
}

module.exports = checkparams