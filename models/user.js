var mongoose = require('mongoose')

var userSchema = mongoose.Schema({
    name: String,
    email: String,
    token: String,
    imei: [{ type: String }],
    hashedPassword: String
});

module.exports = mongoose.model('User', userSchema)