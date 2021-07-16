const express = require("express");
const router = express.Router();
const Auth = require("../middlewares/UserAuth");
const UserController = require("../controllers/userController");

router.get("/login",UserController.login);
router.post("/auth",UserController.UserAuthentication);
router.get("/user",Auth,UserController.userPage);
router.post("/user",UserController.newUser);
router.get("/logout", UserController.logout);
router.get("/check", UserController.checkLogout);

module.exports = router;

