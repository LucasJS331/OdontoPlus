const mongoose = require("mongoose");
const AppoitmentFactory = require("../factories/AppoitmentFactory");
const AppointmentModel = require("../Models/Appointment");
const nodeMailer = require("nodemailer");

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

    async SendNotification(){
        try {
            let appos = await this.getAll(false);
           
            let transporter = nodeMailer.createTransport({
                host: "smtp.mailtrap.io",
                port: 587,
                auth: {
                    user: "9b967a440c89e1",
                    pass: "c6fbd695861f9d"
                }
                   
               })

            appos.forEach( async appo =>{
                let date = appo.start.getTime(); // vai transformar a data em tempo em milesegundos
                let hour = 1000 * 60 * 60 // representação de 1hr
                let gap = date - Date.now();

                if(gap <= hour){
                    if(!appo.notified) {

                        await Appo.findByIdAndUpdate(appo.id, {notified: true});

                        transporter.sendMail({
                            from: "Lucas <lucas.galvao@gmail.com>",
                            to: appo.email,
                            subject: "hora da sua consulta está chegando",
                            text: "Sua consulta é daqui a pouco ;)"
                        })
                        .then(()=> {

                        })
                        .catch(err => console.log(err));
                    }
                }
            })
        } catch (error) {
            console.log(error);
            return [];
        }
    }
}

module.exports = new AppointmentService();