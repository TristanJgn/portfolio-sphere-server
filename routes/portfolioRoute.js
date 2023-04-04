const router = require("express").Router();
const portfolioController = require("../controllers/portfolioController");
const authorize = require("../middleware/authorize");

router.route("/").get(authorize, portfolioController.index);

module.exports = router;
