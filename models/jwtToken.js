var mongoose = require('mongoose')

var tokenDb= mongoose.Schema({
    email: String,
    token: String,
    resetClicked: Boolean
})

module.exports = mongoose.model('tokenDb', tokenDb)