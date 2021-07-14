const AppointmentService = require("../Services/AppointmentService");
const time = 2000;

 module.exports = setInterval(async ()=>{

   await AppointmentService.SendNotification();
    
},time);