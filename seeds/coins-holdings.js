const coinData = [
  {
    id: 1,
    name: "Bitcoin",
    symbol: "BTC",
    price: 9283.92,
    percent_change_1hr: -0.1527,
    percent_change_24hr: 0.5188,
    percent_change_7d: 0.9865,
    market_cap: 852164659250,
    volume_24h: 7155680000,
  },
  {
    id: 2,
    name: "Ethereum",
    sybmol: "ETH",
    price: 1283.92,
    percent_change_1hr: -0.1527,
    percent_change_24hr: 0.5188,
    percent_change_7d: 0.9865,
    market_cap: 158055024432,
    volume_24h: 7155680000,
  },
];

const userHoldingsData = [
  {
    id: 1,
    coin_id: 1,
    coin_name: "Bitcoin",
    coin_amount: 0.5,
  },
  {
    id: 1,
    coin_id: 2,
    coin_name: "Ethereum",
    coin_amount: 2,
  },
  {
    id: 2,
    coin_id: 1,
    coin_name: "Bitcoin",
    coin_amount: 2,
  },
  {
    id: 2,
    coin_id: 2,
    coin_name: "Ethereum",
    coin_amount: 5,
  },
];

exports.seed = async function (knex) {
  // Deletes ALL existing entries
  await knex("coin_data").del();
  await knex("coin_data").insert(coinData);
  await knex("user_holdings").del();
  await knex("user_holdings").insert(userHoldingsData);
};
