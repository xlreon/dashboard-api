var mongoose = require('mongoose')

var tokenDb= mongoose.Schema({
    email: String,
    token: String
})

module.exports = mongoose.model('tokenDb', tokenDb)