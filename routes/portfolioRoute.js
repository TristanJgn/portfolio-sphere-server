const router = require("express").Router();
const portfolioController = require("../controllers/portfolioController");
const authorize = require("../middleware/authorize");

router.route("/").get(authorize, portfolioController.index);

router.route("/:coinId").delete(authorize, portfolioController.deleteCoin);

module.exports = router;