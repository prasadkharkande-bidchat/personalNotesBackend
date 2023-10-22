const { Router } = require("express");
const usersController = require("../controller/users");
const checkToken = require("../../backend/controller/auth/token_validation")

const router = Router();

router.get("/", usersController.getUsers)
router.get("/SignUp", usersController.createNewUser)

router.post("/login", usersController.login);


module.exports = router;