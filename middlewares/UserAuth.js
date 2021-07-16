const appoService = require("../Services/AppointmentService");
 async function Auth(req,res,next){
    if(req.session.user == undefined){
        res.redirect("/login");
    }
    else{
        next();
    }
    
}


module.exports = Auth;