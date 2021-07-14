const appoService = require("../Services/AppointmentService");
 async function Auth(req,res,next){
    if(req.session.user == undefined){
        //res.render("login", {login: {err: false, msg: "" }});
         let appos = await appoService.getAll(true);
         if(appos.lenght <= 0){
             // caso não tiver nenhum usuario cadastrado para realizar login
             next();
         } else{
            res.redirect("/login");
         }
    }
    else{
        next();
    }
}


module.exports = Auth;