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
        return res.status(500).json({
          message: "There was an issue with the request",
          err,
        });
      });
};

exports.addCoin = (req, res) => {
  const { coin_id, coin_name, coin_symbol, coin_amount} = req.body;

  if (!coin_amount) {
    return res.status(400).json({message: "Amount is required"});
  }

  knex("user_holdings")
    .where({ user_id: req.userId, coin_id: coin_id })
    .then((foundCoin) => {
      if (foundCoin.length !== 0) {
        return res.status(400).json({
            message: "Coin is already in portfolio",
        });
      }

      return knex("user_holdings").insert({
        user_id: req.userId,
        coin_id,
        coin_name,
        coin_symbol,
        coin_amount,
      });
    })
    .then(() => {
        return knex("user_holdings").where({
        user_id: req.userId,
        coin_id: coin_id,
        })
        .select(
        "coin_id",
        "coin_name",
        "coin_symbol",
        "coin_amount",
        );
    })
    .then((newCoin) => {
        return res.status(201).json(newCoin[0]);
    })
    .catch((err) => {
      return res.status(500).json({
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
      return res.status(500).json({
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
      return res.status(500).json({
        message: "There was an issue with the request",
        err,
      });
    });
};