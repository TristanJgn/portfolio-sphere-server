const knex = require("knex")(require("../knexfile"));
const axios = require("axios");

// Configuration headers required by CoinMarketCap API to make requests
const axiosHeaders = {
  Accept: "application/json",
  "Accept-Encoding": "deflate, gzip",
  "X-CMC_PRO_API_KEY": process.env.CMC_API_KEY,
};

// Clears coin_data table of old data and replaces it with the new data from the API request
// as well as returns the new data so the route can send it back to the client
async function updateCoinTable (newCoinData) {
  await knex("coin_data").del()
  await knex("coin_data").insert(newCoinData);
  return newCoinData;
}

exports.index = (req, res) => {
  axios
  .get(
    "https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest?limit=10",
    { headers: axiosHeaders }
  )
  .then((response) => {
    const apiData = response.data.data;
    const databaseData = apiData.map((coin) => {
      return {
        id: coin.id,
        name: coin.name,
        symbol: coin.symbol,
        price: coin.quote.USD.price,
        percent_change_1h: coin.quote.USD.percent_change_1h,
        percent_change_24h: coin.quote.USD.percent_change_24h,
        percent_change_7d: coin.quote.USD.percent_change_7d,
        market_cap: coin.quote.USD.market_cap,
        volume_24h: coin.quote.USD.volume_24h,
      };
    });
    return updateCoinTable(databaseData);
  })
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
