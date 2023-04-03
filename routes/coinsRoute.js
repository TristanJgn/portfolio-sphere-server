const router = require("express").Router();
const coinsController = require("../controllers/coinsController");

router
  .route("/")
  .get(coinsController.index)

module.exports = router;
