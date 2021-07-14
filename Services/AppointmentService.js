const mongoose = require("mongoose");
const AppoitmentFactory = require("../factories/AppoitmentFactory");
const AppointmentModel = require("../Models/Appointment");
const nodemailer = require("nodemailer");
const appoToHtml = require("../factories/appoToHtml");

//inicializando o model
let Appo = mongoose.model("Appointment", AppointmentModel);

class AppointmentService{

    async Create(name,email,description,cpf, date,time) {
        let newAppo = new Appo({
            name,
            email,
            description,
            cpf,
            date,
            time,
            finish: false,
            notified: false
        })

        try {
            await newAppo.save();
            return true;

        } catch (error) {
            console.log(error);
            return false;
        }
    }

    async VerifyExistByEmail(email){
        try {
         let user =  await Appo.findOne({email: email});
         if(user != undefined){
             let result = {
                 status: true
             }

             return result;
         }
         else{
            let result = {
                status: false
            }
             return result;
         }
        } catch (error) {
            console.log(error);
            
            let result = {
                status: false
            }

            return result;
        }
    }

    async getAll(showFinish){

        if(showFinish){
            return await Appo.find();
        }
        else{
            let appoitments =  await Appo.find({finish: false});
            let processAppoitments = [];

            appoitments.forEach(appoitment => {

                if(appoitment.date != undefined){
                    processAppoitments.push(AppoitmentFactory.Build(appoitment));
                }
                
            })

            return processAppoitments;
        }
    }

    async getById(id){
        try{
            return await Appo.findById(id);
            
        }
        catch(err){
            console.log(err);
            return undefined;
        }
    }

    async finish(id){
        try {
            await Appo.findByIdAndUpdate(id, {finish: true});
            return true;
        } catch (error) {
            console.log(error);
            return false;
        }
    }
    
    async Search(query){

        try {
            let appos = await await Appo.find().or([{email: query}, {cpf: query}]); // vai achar por email ou por cpf
            return appos;
        } catch (error) {
            console.log(error);
            return [];
            
        }
    }

    async GetAllFinishPure(){
        try {  
            let appoitments =  await Appo.find({finish: false});
            let processAppoitments = [];

            appoitments.forEach(appoitment => {

                if(appoitment.date != undefined){
                    processAppoitments.push(AppoitmentFactory.FullBuild(appoitment));
                }        
            })
            return processAppoitments;
        } catch (error) {
            console.log(error);
            return undefined;
        }
    }

   

    async SendNotification(){
        try {
            let appos = await this.GetAllFinishPure();

            if(appos != undefined){
                const transporter = nodemailer.createTransport({
                    host: 'smtp.ethereal.email',
                    port: 587,
                    auth: {
                        user: 'elna.conn44@ethereal.email',
                        pass: 'AzQpEjupk5tRaMewqU'
                    }
                });
    
                appos.forEach( async appo =>{
                    let date = appo.start.getTime(); // vai transformar a data em tempo em milesegundos
                    let hour = 1000 * 60 * 60 // representação de 1hr
                    let gap = date - Date.now();
    
                    if(gap <= hour){
                        if(!appo.notified) {
    
                            await Appo.findByIdAndUpdate(appo.id, {notified: true});
                            let newAppo = appoToHtml(appo);
    
                            transporter.sendMail({
                                from: "Lucas <lucas.galvao@gmail.com>",
                                to: newAppo.userEmail,
                                subject: newAppo.subject,
                                text: "Sua consulta é daqui a pouco ;)",
                                html: newAppo.html
                            })
                        }
                    }
                })
            }
        } catch (error) {
            console.log(error);
            return [];
        }
    }
}

module.exports = new AppointmentService();