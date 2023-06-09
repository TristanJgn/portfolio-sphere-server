const router = require("express").Router();
const portfolioController = require("../controllers/portfolioController");
const authorize = require("../middleware/authorize");

router
  .route("/")
  .get(authorize, portfolioController.index)
  .post(authorize, portfolioController.addCoin);

router
  .route("/:coinId")
  .put(authorize, portfolioController.updateCoinAmount)
  .delete(authorize, portfolioController.deleteCoin);

module.exports = router;
