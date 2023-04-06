const router = require("express").Router();
const dashboardController = require("../controllers/dashboardController");
const authorize = require("../middleware/authorize");

router
  .route("/")
  .get(authorize, dashboardController.index);

module.exports = router;
