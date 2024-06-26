const mongoose = require('mongoose');

const user = new mongoose.Schema({
    username: {
        type: String
    },
    email: {
        type: String,
        required: [true, "Please provide an Email!"],
        unique: [true, "Email Exist"],
    },

    password: {
        type: String,
        required: [true, "Please provide a password!"],
        unique: false,
    },
});

module.exports = mongoose.model('User', user);