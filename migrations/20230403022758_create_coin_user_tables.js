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
      table.integer("market_cap").notNullable(); // Use integer as these values should be rounded
      table.integer("volume_24hr").notNullable(); // Use integer as these values should be rounded
      table.timestamp("updated_at").defaultTo(knex.fn.now());
    })
    .createTable("user_holdings", (table) => {
      table.increments("id").primary();
      table
        .uuid("coin_id")
        .references("coin_data.id")
        .onUpdate("CASCADE")
        .onDelete("CASCADE");
      table.string("coin_name").notNullable();
      table.decimal("coin_amount", 14, 8).notNullable(); // Allow up to 8 decimals as cryptocurrency holdings can be a small fraction
      table.timestamp("updated_at").defaultTo(knex.fn.now());
    });
};

exports.down = function (knex) {
  return knex.schema.dropTable("user_holdings").dropTable("coin_data");
};
