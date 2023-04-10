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
  // Checking that it has been longer than 5 minutes since the last database update to prevent multiple API calls if many clients are running
  knex("coin_data")
    .select("updated_at") // Grab column of timestamp when the last API call was made
    .then((lastUpdated) => {
      if (lastUpdated.length === 0) { // If there is no coin_data, manually set the time difference to 100 to trigger an API request (mainly used for first time setup)
        const timeDifferenceInMinutes = 100;
        return timeDifferenceInMinutes; 
      }
      const lastUpdatedTime = lastUpdated[0].updated_at.getTime() / 1000; // Take the first timestamp for simplicity (all records will be the same)
      const currentDateLocal = new Date();
      const currentDateUTC = new Date(currentDateLocal.getTime() + currentDateLocal.getTimezoneOffset() * 60000); // Shifting local date to match UTC time
      const currentTimeUTC = currentDateUTC.getTime() / 1000; // Get the current time in UTC so it is comparable against the API data which returns a UTC timestamp

      const timeDifferenceInMinutes =
        (currentTimeUTC - lastUpdatedTime) / 60; // Find the difference in minutes between the current time and last updated time
      return timeDifferenceInMinutes;
    })
    .then((timeDifferenceInMinutes) => {
      if (timeDifferenceInMinutes > 5) { // Make the API request to refresh the data if it has been longer than 5 minutes since the last successful API call
        axios
          .get(
            "https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest?limit=100",
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
      } else { // Return the existing data in the table from the last update
        knex("coin_data")
        .select(
        "id",
        "name",
        "symbol",
        "price",
        "percent_change_1h",
        "percent_change_24h",
        "percent_change_7d",
        "market_cap",
        "volume_24h",
        )
        .orderBy("market_cap", "desc")
          .then((data) => res.json(data))
          .catch((err) => {
            res.status(500).json({
              message: "There was an issue with the request",
              err,
            });
          });
      }
    })
    .catch((err) => {
      res.status(500).json({
        message: "There was an issue with the request",
        err,
      });
    });
};
