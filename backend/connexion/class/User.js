const mongoose = require('mongoose');

const valSchema = new mongoose.Schema({
    pseudo: String,
    email: String,
    avatar: String
});

module.exports = mongoose.model('User', valSchema);