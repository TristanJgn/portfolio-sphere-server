exports.up = function (knex) {
  return knex.schema
    .createTable("users", (table) => {
      table.uuid("id").primary();
      table.string("email").notNullable();
      table.string("password").notNullable();
      table.timestamp("updated_at").defaultTo(knex.fn.now());
    })
    .createTable("user_holdings", (table) => {
      table.increments("id").primary();
      table
        .uuid("user_id")
        .references("users.id")
        .onUpdate("CASCADE")
        .onDelete("CASCADE");
      table.uuid("coin_id");
      table.string("coin_name").notNullable();
      table.string("coin_symbol").notNullable();
      table.decimal("coin_amount", 22, 8).notNullable(); // Allow up to 8 decimals as cryptocurrency holdings can be a small fraction
      table.timestamp("updated_at").defaultTo(knex.fn.now());
    });
};

exports.down = function (knex) {
  return knex.schema.dropTable("user_holdings").dropTable("users");
};
