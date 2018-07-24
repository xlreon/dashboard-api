var mongoose = require('mongoose')

var userSchema = mongoose.Schema({
    name: String,
    email: String,
    e_no: Number,
    hashedPassword: String,
    salt: String,
    files: [{
        key: String,
        name: String,
        location: String
    }],
    mobileinfos: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Mobileinfo'
        }
    ]
})

module.exports = mongoose.model('User', userSchema)