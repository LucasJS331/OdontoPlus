const express = require("express")
const app = express();
const port = 3000;
const mongoose = require("mongoose");
const UserRouter = require("./Router/UserRouter");
const AppointmentRouter = require("./Router/AppointmentRoute");
const session = require("express-session");



// basic configuration
app.set("view engine", "ejs");
app.use(express.urlencoded({extended: false}));
app.use(express.json());
app.use(express.static("public"));
mongoose.set('useFindAndModify', false);

app.use(session({
    secret: "ajdjenf",
    cookie: {maxAge: 172800000, secure: false},
    resave: false,
    saveUninitialized: true
}))

app.use("/", UserRouter);
app.use("/", AppointmentRouter);

// db connection

mongoose.connect("mongodb://localhost:27017/agendamento", {useNewUrlParser: true, useUnifiedTopology: true});



app.listen(port, ()=>{
    console.log("app está rodando na porta " + port);
})

//todoo: BOA PRATICA MAN, BOAS PRATICAS, Faça a partial do menu kkkk
//todoo: tambem faz o esquema de logout e teste todo o sistema