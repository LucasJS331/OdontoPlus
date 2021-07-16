const UserService = require("../Services/UserService");
const Auth = require("../middlewares/UserAuth");
const validator = require("validator");

class UserController {
    login(req,res){
        res.locals.title = "login";

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
        res.locals.title = "cadastro";

        let nameError = req.flash("nameError");
        let nameValue = req.flash("nameValue");
        let passwordError = req.flash("passwordError");
        let passwordValue = req.flash("passwordValue");
        let emailError = req.flash("emailError");
        let emailExist = req.flash("emailExist");
        let emailValue = req.flash("emailValue");


        if(nameError == undefined || nameError.length == 0){
            nameError = "";
        }

        
        if(nameValue == undefined || nameValue.length == 0){
            nameValue = "";
        }

        if(passwordError == undefined || passwordError.length == 0){
            passwordError = "";
        }

        if(passwordValue == undefined || passwordValue.length == 0){
            passwordValue = "";
        }

        if(emailError == undefined || emailError.length == 0){
            emailError = "";
        }

        if(emailExist == undefined || emailExist.length == 0){
            emailExist = "";
        }

        if(emailValue == undefined || emailValue.length == 0){
            emailValue = "";
        }
        
        res.render("user", {
             nameError,
             nameValue,
             passwordValue,
             passwordError,
             emailValue,
             emailError,
             emailExist
            });
    }

   async newUser(req,res){
        let {name,password,email} = req.body;

        let nameError;
        let emailError;
        let passwordError;
        let emailExist;
    
        if(password == undefined || password.trim() == "" || password.length < 6){
            passwordError = "senha invalida!";
        
        }

        if(name == undefined || name.trim() == ""){
            nameError = "nome invalido!"
        }

        if(!validator.isEmail(email)){
            
            emailError = "email é invalido!";
          
        } else{
            
            try {
                let result = await UserService.VerifyUserExistByEmail(email);

                if(result){
                    emailExist = "esse email já está cadastrado!";
                }
  
            } catch (error) {
                console.log(error);
            }
        }

        if(emailError != undefined || passwordError != undefined || nameError != undefined || emailExist != undefined){
            req.flash("nameError", nameError);
            req.flash("nameValue", name);
            req.flash("emailError", emailError);
            req.flash("emailValue", email);
            req.flash("passwordError", passwordError);
            req.flash("passwordValue", password);
            req.flash("emailExist", emailExist);
            res.redirect("/user");
            return;
        }
    
    
        try{
            let result = await UserService.CreateUser(name,email,password);
            
            if(result.status)
            {
                res.locals.title = "Sucesso!";
                res.render("success");
                return;
            }
            else{
                console.log("aaaa");
                res.redirect("/user");
                return;
            }
        }
        catch(err){
            console.log(err);
            res.redirect("/user");
        }
    }

    logout(req,res){
        res.locals.title = "logout";

        if(req.session.user != undefined){
            req.session.user = undefined;
    
            res.render("logout");
    
    
        } else{
            res.redirect("/");
        }
    }

    checkLogout(req,res){
        res.locals.title = "checkLogout";
        res.render("checkLogout");
    }
}

module.exports = new UserController();