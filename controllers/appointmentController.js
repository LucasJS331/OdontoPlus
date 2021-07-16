const AppointmentService = require("../Services/AppointmentService");
const validator = require("validator");

class AppointmentController{
    index(req,res){
        res.locals.title = "Bem vindo - OdontoPlus";
        res.render("index");
    }

    createAppoPage(req,res){
        let nameError = req.flash("nameError");
        let nameValue = req.flash("nameValue");
        let descriptionError = req.flash("descriptionError");
        let descriptionValue = req.flash("descriptionValue");
        let emailError = req.flash("emailError");
        let emailExist = req.flash("emailExist");
        let emailValue = req.flash("emailValue");
        let cpfError = req.flash("cpfError");
        let cpfValue = req.flash("cpfValue");
        let timeError = req.flash("timeError");
        let timeValue = req.flash("timeValue");
        let dateError = req.flash("dateError");
        let dateValue = req.flash("dateValue");


        if(nameError == undefined || nameError.length == 0){
            nameError = "";
        }

        
        if(nameValue == undefined || nameValue.length == 0){
            nameValue = "";
        }

        if(descriptionError == undefined || descriptionError.length == 0){
            descriptionError = "";
        }

        if(descriptionValue == undefined || descriptionValue.length == 0){
            descriptionValue = "";
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

        if(cpfError == undefined || cpfError.length == 0){
            cpfError = "";
        }

        
        if(cpfValue == undefined || cpfValue.length == 0){
            cpfValue = "";
        }

        if(timeError == undefined || timeError.length == 0){
            timeError = "";
        }

        
        if(timeValue == undefined || timeValue.length == 0){
            timeValue = "";
        }

        if(dateError == undefined || dateError.length == 0){
            dateError = "";
        }

        
        if(dateValue == undefined || dateValue.length == 0){
            dateValue = "";
        }
        res.locals.title = "Criar consulta";     
        res.render("create", {
             nameError,
             nameValue,
             descriptionValue,
             descriptionError,
             emailValue,
             emailError,
             emailExist,
             cpfError,
             cpfValue,
             timeError,
             timeValue,
             dateValue,
             dateError
            });

        
       
    }

   async createAppo(req,res){
        let {name,email,description,cpf,date,time } = req.body;

        let nameError;
        let emailError;
        let descriptionError;
        let cpfError;
        let dateError;
        let timeError;
        let emailExist;

    
        if(description == undefined || description.trim() == ""){
            descriptionError = "descrição invalida!";
        
        }

        if(name == undefined || name.trim()== ""){
            nameError = "nome invalido!"
        }

        if(cpf == undefined || cpf.trim() == "" || cpf.length < 14){
            cpfError = "cpf invalido!";
        
        }

        if(date == undefined || date.trim() == ""){
            dateError = "data invalida";
        }

        if(time == undefined || time.trim() == ""){
            timeError = "tempo invalido";
        }

        if(!validator.isEmail(email)){
            
            emailError = "email é invalido!";
          
        } else{
            
            try {
                let result = await AppointmentService.VerifyExistByEmail(email);

                if(result.status){
                    emailExist = "esse email já está cadastrado!";
                }
  
            } catch (error) {
                console.log(error);
            }
        }

        if(emailError != undefined || descriptionError != undefined || nameError != undefined || emailExist != undefined || cpfError != undefined || dateError != undefined || timeError != undefined){
            req.flash("nameError", nameError);
            req.flash("nameValue", name);
            req.flash("emailError", emailError);
            req.flash("emailValue", email);
            req.flash("emailExist", emailExist);
            req.flash("descriptionError", descriptionError);
            req.flash("descriptionValue", description);
            req.flash("cpfError", cpfError);
            req.flash("cpfValue", cpf);
            req.flash("dateError", dateError);
            req.flash("dateValue", date);
            req.flash("timeError", timeError);
            req.flash("timeValue", time);
            res.redirect("/cadastro");
            return;
        }

            try {
                let result = await AppointmentService.Create(name,email,description,cpf, date,time);

                if(result){
                    res.locals.title = "Sucesso!"
                    res.render("success");
                    return;
                }
                else{
                    res.redirect("/");
                    return;
                }
            } catch (error) {
                console.log(error);
                res.redirect("/login");
            }
        
    }

    async getCalendar(req,res){
        let appoitments = await AppointmentService.getAll(false);

        res.json(appoitments);
    }

    async Event(req,res){
        res.locals.title = "Consulta";
        let id = req.params.id;

        if(!validator.isMongoId(id)){
            return;
        }
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

        res.locals.title = "Consultas";
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