class AppointmentFactory {

    Build(oldAppoitment){
        let day = oldAppoitment.date.getDate() +1;
        let month = oldAppoitment.date.getMonth();
        let year = oldAppoitment.date.getFullYear();
        let hour = parseInt(oldAppoitment.time.split(":")[0]);
        let min =  parseInt(oldAppoitment.time.split(":")[1]);

        let startDate = new Date(year,month,day,hour,min,0,0);
        

        let newAppoitment = {

            id: oldAppoitment._id,
            title: oldAppoitment.name + " - " + oldAppoitment.description,
            start: startDate,
            and: startDate,
            notified: oldAppoitment.notified,
            email: oldAppoitment.email,

        }

        return newAppoitment;
      
    }
}

module.exports = new AppointmentFactory();