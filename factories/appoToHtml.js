const dateformat = require("dateformat");

function appoToHtml(appo){
    let newAppo ={
        userEmail: appo.email,
        subject: "Hey," + appo.name + "! a hora da sua consulta está chegando.",
        html: "<h1> Olá," + appo.name + "</h1> <p> sua consulta é daqui a pouco! Confira os detalhes:" +
        "<p>Descrição: " + appo.description + "</p> <p> Data: " + dateformat(appo.date, "dd/mm/yyyy") + "</p>" + 
        "<p>Horario: " + appo.time + "</p>"
    }

    return newAppo;
}

module.exports = appoToHtml;