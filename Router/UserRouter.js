const express = require("express");
const router = express.Router();
const UserService = require("../Services/UserService");
const Auth = require("../middlewares/UserAuth");
const validator = require("validator");

router.get("/login", (req,res)=>{
    res.render("login", {login: {err: false, msg: "" }});


})

router.post("/auth", async (req,res)=>{
    let {email, password} = req.body;

    if(!validator.isEmail(email)){
        res.render("login", {login: {err: true, msg: "Email ou senha invalidas!" }});
        return;
    }

    if(password == undefined || password == " "){
        res.render("login", {login: {err: true, msg: "Email ou senha invalidas!" }});
        return;
    }

    try {
        let auth = await UserService.Auth(email,password);


        if(auth.status){
           req.session.user = {
               email: auth.email,
               name: auth.name
           }
    
            res.redirect("/");
        }
    
        else{
            res.render("login", {login: {err: true, msg: "Email ou senha incorretos!" }});
        }
    } catch (error) {
        console.log(error);
        res.render("login", {login: {err: true, msg: "Ocorreu um erro, tente novamente mais tarde!" }});
    }
})


router.get("/user",Auth,(req,res)=>{
    res.render("User");
})
router.post("/newUser", async (req,res) =>{

    let {name,password,email} = req.body;

    if(!validator.isEmail(email)){
        res.redirect("/user");
        return;
    }

    if(!validator.isStrongPassword(password, {minLength: 6})){
        res.redirect("/user");
        return;
    }

    if(name == undefined || name == " "){
        res.redirect("/user");
        return;
    }

    try{
        let result = await UserService.CreateUser(name,email,password);
        
        if(result.status)
        {
            res.render("success", {msg: "Usuario habilitado com sucesso para fazer o uso do sistema :)"});
            return;
        }
        else{
            res.json({err: result.err});
            return;
        }
    }
    catch(err){
        console.log(err);
        res.json({err: "ocorreu um erro, tente novamente mais tarde!"});
    }
})


router.get("/logout", (req,res)=>{
    if(req.session.user != undefined){
        req.session.user = undefined;

        res.render("logout");


    } else{
        res.redirect("/");
    }
})

router.get("/check", (req,res)=>{
    res.render("checkLogout");
})
module.exports = router;

