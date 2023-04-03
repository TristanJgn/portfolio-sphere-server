const knex = require("knex")(require("../knexfile"));

exports.index = (req, res) => {
  knex("coin_data")
    .then((data) => {
      res.json(data);
    })
    .catch((err) => {
      res.status(500).json({
        message: "There was an issue with the request",
        err,
      });
    });
};
