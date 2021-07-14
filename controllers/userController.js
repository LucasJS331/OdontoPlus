const UserService = require("../Services/UserService");
const Auth = require("../middlewares/UserAuth");
const validator = require("validator");

class UserController {
    login(req,res){

        let emailError = req.flash("emailError");
        let passwordError = req.flash("passwordError");
        let msgError = req.flash("msgError");
        let email = req.flash("email");
        let wrongPassword =  req.flash("wrongPassword");

        if(emailError == undefined || emailError.length == 0){
            emailError = "";
        }

        if(passwordError == undefined || passwordError.length == 0){
            passwordError = "";
        }

        if(msgError == undefined || msgError.length == 0){
            msgError = "";
        }

        
        if(email == undefined || email.length == 0){
            passwordError = "";
        }

        if(wrongPassword == undefined || wrongPassword.length == 0){
            msgError = "";
        }
        res.render("login", {
            emailError,
            passwordError,
            msgError,
            email,
            wrongPassword
        });
    }

   async UserAuthentication(req,res){
        let {email, password} = req.body;

        let emailError;
        let passwordError;

        if(!validator.isEmail(email)){
           emailError = "email invalido";
        }
    
        if(password == undefined || password == " "){
            passwordError = "senha invalida!";
        
        }

        if(emailError != undefined || passwordError != undefined){
            req.flash("emailError", emailError);
            req.flash("email", email);
            req.flash("passwordError", passwordError);
            res.redirect("/login");
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
                req.flash("msgError", "Email ou senha incorretos!");
                req.flash("email", email);
                req.flash("wrongPassword", password);
                res.redirect("/login")
            }
        } catch (error) {
            console.log(error);
            res.render("login");
        }
    }

    userPage(req,res){
        res.render("User");
    }

   async newUser(req,res){
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
    }

    logout(req,res){
        if(req.session.user != undefined){
            req.session.user = undefined;
    
            res.render("logout");
    
    
        } else{
            res.redirect("/");
        }
    }

    checkLogout(req,res){
        res.render("checkLogout");
    }
}

module.exports = new UserController();