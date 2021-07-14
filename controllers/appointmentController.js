const AppointmentService = require("../Services/AppointmentService");
const validator = require("validator");

class AppointmentController{
    index(req,res){
        res.render("index");
    }

    createAppoPage(req,res){
        res.render("create");
    }

   async createAppo(req,res){
        let {name,email,description,cpf,date,time } = req.body;

        if(name == undefined || ""){
            res.redirect("/cadastro");
            return;
        }

        if(!validator.isEmail(email)){
            res.redirect("/cadastro");
            return;
        }

        if(description == undefined || ""){
            res.redirect("/cadastro");
            return;
        }

        if(cpf == undefined || ""){
            res.redirect("/cadastro");
            return;
        }

        if(date == undefined || ""){
            res.redirect("/cadastro");
            return;
        }

        if(time == undefined || ""){
            res.redirect("/cadastro");
            return;
        }

        let verify = await AppointmentService.VerifyExistByEmail(email);

        if(!verify.status){

            try {
                let result = await AppointmentService.Create(name,email,description,cpf, date,time);

                if(result){
                    res.render("success", {msg: "consulta realizada com sucesso, consulte a home para ver mais detalhes!"});
                    return;
                }
                else{
                    res.redirect("/cadastro");
                    return;
                }
            } catch (error) {
                console.log(error);
                res.redirect("/cadastro");
            }

        }else{
            res.redirect("/cadastro");
        }
    }

    async getCalendar(req,res){
        let appoitments = await AppointmentService.getAll(false);

        res.json(appoitments);
    }

    async Event(req,res){
        let id = req.params.id;

        let result = await AppointmentService.getById(id);
   
       if(result != undefined){
           res.render("event", {appo: result});
       }
       else{
           res.redirect("/");
       }
   
    }

   async  finish(req,res){
        let {id} = req.body;
    
        if(id != undefined){
            let result = await AppointmentService.finish(id);
    
            if(result){
                res.redirect("/");
                return;
            } else{
                res.redirect("/");
                return;
            }
    
        }else{
            res.redirect("/");
            return;
        }
    
    }

    async getListAppo(req,res){
        
        let result = await AppointmentService.getAll(true);

        res.render("list", {appos: result});
    }

    async searchAppo(req,res){
        let query = req.query.search;

        if(query != undefined){
            try {
                let result = await AppointmentService.Search(query);
                res.render("list", {appos: result});
            } catch (error) {
                res.render("list", {appos: []});
                console.log(error);
            }
        } else{
            res.redirect("/list");
        }
    }
}

module.exports = new AppointmentController();