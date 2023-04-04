const bcrypt = require("bcrypt");
require("dotenv").config();

let usersData = [
  {
    id: 1,
    email: "johnsmith@test.com",
    password: "password",
  },
  {
    id: 2,
    email: "janedoe@test.com",
    password: "password",
  },
];

usersData = usersData.map((user) => ({
  ...user,
  password: bcrypt.hashSync(
    user.password,
    Number(process.env.BCRYPT_SALT_ROUNDS)
  ),
}));

const userHoldingsData = [
  {
    user_id: 1,
    coin_id: 1,
    coin_name: "Bitcoin",
    coin_symbol: "BTC",
    coin_amount: 0.5,
  },
  {
    user_id: 1,
    coin_id: 2,
    coin_name: "Ethereum",
    coin_symbol: "ETH",
    coin_amount: 2,
  },
  {
    user_id: 2,
    coin_id: 1,
    coin_name: "Bitcoin",
    coin_symbol: "BTC",
    coin_amount: 2,
  },
  {
    user_id: 2,
    coin_id: 2,
    coin_name: "Ethereum",
    coin_symbol: "ETH",
    coin_amount: 5,
  },
];

exports.seed = async function (knex) {
  await knex("users").del();
  await knex("users").insert(usersData);
  await knex("user_holdings").del();
  await knex("user_holdings").insert(userHoldingsData);
};
