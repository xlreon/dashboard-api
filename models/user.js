var mongoose = require('mongoose')

var userSchema = mongoose.Schema({
    name: String,
    email: String,
    e_no: Number,
    hashedPassword: String,
    salt: String,
    tmpsalt: String,
    mobileinfos: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Mobileinfo'
        }
    ],
    verified: { type: Boolean, default: false }
})

module.exports = mongoose.model('User', userSchema)