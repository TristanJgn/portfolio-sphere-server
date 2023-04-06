const router = require("express").Router();
const portfolioController = require("../controllers/portfolioController");
const authorize = require("../middleware/authorize");

router
  .route("/")
  .get(authorize, dashboardController.index);

module.exports = router;
