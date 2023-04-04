const knex = require("knex")(require("../knexfile"));

exports.index = (req, res) => {
    knex("user_holdings")
      .select(
        "coin_id",
        "coin_name",
        "coin_symbol",
        "coin_amount",
      )
      .where({ user_id: req.userId })
      .then((holdings) => {
        return res.json(holdings);
      })
      .catch((err) => {
        res.status(500).json({
          message: "There was an issue with the request",
          err,
        });
      });
};