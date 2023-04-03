const router = require("express").Router();
const usersController = require("../controllers/usersController");

// router.route("/login").post(usersController.login);

router.route("/register").post(usersController.register);

module.exports = router;