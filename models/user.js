var mongoose = require('mongoose')

var userSchema = mongoose.Schema({
    name: String,
    email: String,
    hashedPassword: String,
    salt: String,
    images: [{
        data: Buffer,
        contentType: String
    }],
    videos: [{
        data: Buffer,
        contentType: String
    }],
    contacts: [{
        data: Buffer,
        contentType: String
    }],
    mobileinfos: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Mobileinfo'
        }
    ]
})

module.exports = mongoose.model('User', userSchema)