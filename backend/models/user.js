const { Schema, model } = require('mongoose')

const userSchema = new Schema({
    active: { type: Boolean, default: true },
    roomId: { type: String, required: true },
    users: [
        {
            _id: false,
            username: { type: String, required: true },
            role: { type: String, eum: ['0', '1'], default: '0' },
        },
    ],
})

module.exports = model('User', userSchema)
