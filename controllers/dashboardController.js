const knex = require("knex")(require("../knexfile"));

exports.index = (req, res) => {
  knex("coin_data")
    .join("user_holdings", "coin_data.id", "=", "user_holdings.coin_id")
    .select(
      "coin_data.id",
      "coin_data.name",
      "coin_data.symbol",
      "coin_data.price",
      "user_holdings.coin_amount",
      "coin_data.percent_change_24h"
    )
    .where({ "user_holdings.user_id": req.userId })
    .then((data) => {
      return res.json(data);
    })
    .catch((err) => {
      return res.status(500).json({
        message: "There was an issue with the request",
        err,
      });
    });
};