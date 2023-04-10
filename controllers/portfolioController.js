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

exports.addCoin = async (req, res) => {
  try {
    const { coin_id, coin_name, coin_symbol, coin_amount} = req.body;

    // Check that the amount trying to be entered is greater than 0
    if (coin_amount <= 0) {
      return res.status(400).json({ message: "Invalid amount" });
    }

    // Check that the user doesn't already have the coin in their portfolio
    const foundCoin = await knex("user_holdings").where({ user_id: req.userId, coin_id: coin_id })

    if (foundCoin.length !== 0) {
      return res.status(400).json({
          message: "Coin is already in portfolio",
      });
    }

    // If it is a new coin, then insert it into the user holdings table
    await knex("user_holdings").insert({
      user_id: req.userId,
      coin_id,
      coin_name,
      coin_symbol,
      coin_amount,
    });

    // Grab the newly added coin and return it with a 201 status to let the user know it has been successfully created
    const newCoin = await knex("user_holdings").where({
    user_id: req.userId,
    coin_id: coin_id,
    })
    .select(
    "coin_id",
    "coin_name",
    "coin_symbol",
    "coin_amount",
    );

    res.status(201).json(newCoin[0]);
  }
  catch (err) {
    return res.status(500).json({
      message: "There was an issue with the request",
      err,
    });
  }
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
  // Check that the amount trying to be entered is greater than 0
  if (req.body.coin_amount <= 0) {
    return res.status(400).json({ message: "Invalid amount" });
  }

  knex("user_holdings")
    .where({ user_id: req.userId, coin_id: req.params.coinId })
    .update({
      coin_amount: req.body.coin_amount,
    })
    .then(() => {
      return knex("user_holdings").where({
        user_id: req.userId,
        coin_id: req.params.coinId,
      });
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