const mongoose = require('mongoose');

const user = new mongoose.Schema({
    nome: String,
    email: String,
    idade: Number
});

module.exports = mongoose.model('User', user);

