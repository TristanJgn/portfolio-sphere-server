exports.up = function (knex) {
  return knex.schema
    .createTable("coin_data", (table) => {
      table.uuid("id").primary();
      table.string("name").notNullable();
      table.string("symbol").notNullable();
      table.decimal("price", 14, 2).notNullable(); // Allows for price to be 14 numbers with 2 decimals for the cents
      table.decimal("percent_change_1hr", 14, 4).notNullable(); // Percentage to be displayed with 2 decimal points when multiplied by 100 so must allow 4 decimals
      table.decimal("percent_change_24hr", 14, 4).notNullable(); // Percentage to be displayed with 2 decimal points when multiplied by 100 so must allow 4 decimals
      table.decimal("percent_change_7d", 14, 4).notNullable(); // Percentage to be displayed with 2 decimal points when multiplied by 100 so must allow 4 decimals
      table.decimal("market_cap", 14, 0).notNullable(); // Use decminal as values exceed the integer limit
      table.decimal("volume_24hr", 14, 0).notNullable(); // Use decminal as values exceed the integer limit
      table.timestamp("updated_at").defaultTo(knex.fn.now());
    });
};

exports.down = function (knex) {
  return knex.schema
    .dropTable("coin_data")
};
