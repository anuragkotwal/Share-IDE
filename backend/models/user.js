const {Schema, model} = require('mongoose');

const userSchema = new Schema({
    username:{type: String, required: true},
    roomId: {type: String, required: true},
    role: {type: String, eum: ['0', '1'], default: '0'},
})

module.exports = model('User', userSchema);