const express = require("express")
const app = express();
const port = 3000;
const mongoose = require("mongoose");
const UserRouter = require("../Router/UserRouter");
const AppointmentRouter = require("../Router/AppointmentRoute");
const session = require("express-session");
const notification = require("./notification");
const flash = require('express-flash')



// basic configuration
app.set("view engine", "ejs");
app.use(express.urlencoded({extended: false}));
app.use(express.json());
app.use(express.static("public"));
mongoose.set('useFindAndModify', false);
app.use(session({
    secret: process.env.SECRET,
    cookie: {maxAge: 172800000, secure: false},
    resave: false,
    saveUninitialized: true
}))
app.use(flash());

app.use("/", UserRouter);
app.use("/", AppointmentRouter);


// db connection

mongoose.connect(process.env.MONGO_URL, {useNewUrlParser: true, useUnifiedTopology: true});



app.listen(port, ()=>{
    console.log("app está rodando na porta " + port);
})

