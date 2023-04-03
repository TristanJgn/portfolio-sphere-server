const router = require("express").Router();
const usersController = require("../controllers/usersController");

router.route("/login").post(coinsController.login);

router.route("/register").post(coinsController.register);

module.exports = router;