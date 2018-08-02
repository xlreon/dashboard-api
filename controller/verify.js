var express = require('express')
var router = express.Router();
var User = require('../models/user')

router.get('/:id', (req, res) => {
    var response = {}
    User.findOneAndUpdate({ tmpsalt: req.params.id }, { $set: { 'verified': true } }, (err, user) => {
        if (!err && user) {
            res.send('Your Email Has Been Verified : ' + user.email)
        } else {
            if (!user) {
                response = {
                    status: -18,
                    body: {
                        info: "invalid verification route",
                        error: null,
                        content: null
                    }
                }
                res.send(JSON.stringify(response))
            } else {
                response = {
                    status: -2,
                    body: {
                        info: "user db eroor",
                        error: err,
                        content: null
                    }
                }
                res.send(JSON.stringify(response))
            }
        }
    })
})

module.exports = router