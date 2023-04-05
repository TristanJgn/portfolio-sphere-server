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

exports.deleteCoin = (req, res) => {
  knex("user_holdings")
    .where({ user_id: req.userId, coin_id: req.params.coinId })
    .del()
    .then((numberOfCoinsDeleted) => {
      if (numberOfCoinsDeleted === 0) {
        return res.status(404).json({
          message: "Coin does not exist in portfolio",
        });
      }

      res.sendStatus(204);
    })
    .catch((err) => {
      res.status(500).json({
        message: "There was an issue with the request",
        err,
      });
    });
};

exports.updateCoinAmount = (req, res) => {
  knex("user_holdings")
    .where({ user_id: req.userId, coin_id: req.params.coinId })
    .update({
        coin_amount: req.body.coin_amount,
    })
    .then(() => {
        return knex("user_holdings")
        .where({ user_id: req.userId, coin_id: req.params.coinId });
    })
    .then((coins) => {
        if (coins.length === 0) {
          return res.status(404).json({
            message: `Unable to find coin with id: ${req.params.coinId}`,
          }); 
        }
        res.status(200).json(coins[0]);
    })
    .catch((err) => {
      res.status(500).json({
        message: "There was an issue with the request",
        err,
      });
    });
};