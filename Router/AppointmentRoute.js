const {Router} = require("express");
const route = Router();
const Auth = require("../middlewares/UserAuth");
const appointmentController = require("../controllers/appointmentController");

route.get("/", Auth, appointmentController.index)
route.get("/cadastro", Auth, appointmentController.createAppoPage);
route.post("/create", appointmentController.createAppo);
route.get("/getCalendar", Auth, appointmentController.getCalendar);
route.get("/event/:id", Auth, appointmentController.Event);
route.post("/finish", appointmentController.finish);
route.get("/list", Auth, appointmentController.getListAppo);
route.get("/search", appointmentController.searchAppo);


module.exports = route;