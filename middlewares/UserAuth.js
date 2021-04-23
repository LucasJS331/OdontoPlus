function Auth(req,res,next){
    if(req.session.user == undefined){
        res.render("login", {login: {err: false, msg: "" }});
    }
    else{
        next();
    }
}


module.exports = Auth;