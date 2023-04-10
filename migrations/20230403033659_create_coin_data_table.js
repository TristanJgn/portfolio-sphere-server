exports.up = function (knex) {
  return knex.schema
    .createTable("coin_data", (table) => {
      table.uuid("id").primary();
      table.string("name").notNullable();
      table.string("symbol").notNullable();
      table.decimal("price", 36, 21).notNullable(); // Allows for price to be 21 digits including 21 decimals for the cents as that is what the API returns (need to allow for this to maintain precision of certain coins that have really low prices i.e. less than $0.01)
      table.decimal("percent_change_1h", 18, 4).notNullable(); // Percentage to be displayed with 2 decimal points when multiplied by 100 so must allow 4 decimals
      table.decimal("percent_change_24h", 18, 4).notNullable(); // Percentage to be displayed with 2 decimal points when multiplied by 100 so must allow 4 decimals
      table.decimal("percent_change_7d", 18, 4).notNullable(); // Percentage to be displayed with 2 decimal points when multiplied by 100 so must allow 4 decimals
      table.decimal("market_cap", 14, 0).notNullable(); // Use decminal as values exceed the integer limit
      table.decimal("volume_24h", 14, 0).notNullable(); // Use decminal as values exceed the integer limit
      table.timestamp("updated_at").defaultTo(knex.fn.now());
    });
};

exports.down = function (knex) {
  return knex.schema
    .dropTable("coin_data")
};
