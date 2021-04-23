const mongoose = require("mongoose");
// isso no mongo se chama schema é tipo um model que representa uma coleção no mongo
const User = new mongoose.Schema({
    name: String,
    email: String,
    password: String,
})

module.exports = User;