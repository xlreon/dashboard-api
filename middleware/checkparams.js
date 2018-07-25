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
        case '/phone/get':
            if (!req.body.imei) { missing.push('imei') }
            break
        case '/phone/set':
            if (!req.body.imei) { missing.push('imei') }
            if (!req.body.device) {
                missing.push('device')
            } else {
                if (!req.body.device.name) { missing.push('device[name]') }
                if (!req.body.device.os) { missing.push('device[os]') }
                if (!req.body.device.battery) { missing.push('device[battery]') }
                if (!req.body.device.wifi) { missing.push('device[wifi]') }
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
            if (!req.body.lon) { missing.push('lon') }
            if (!req.body.imei) { missing.push('imei') }
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