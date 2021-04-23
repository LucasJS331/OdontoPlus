const mongoose = require("mongoose");


// isso no mongo se chama schema é tipo um model que representa uma coleção no mongo
const Appointment = new mongoose.Schema({
    name: String,
    email: String,
    description: String,
    cpf: String,
    date: Date,
    time: String,
    finish: Boolean,
    notified: Boolean
})

module.exports = Appointment;