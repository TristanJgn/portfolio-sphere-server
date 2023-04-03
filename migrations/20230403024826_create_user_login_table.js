exports.up = function (knex) {
  return knex.schema
    .createTable("user_logins", (table) => {
      table.uuid("id").primary();
      table.string("email").notNullable();
      table.string("password").notNullable();
      table.timestamp("updated_at").defaultTo(knex.fn.now());
    })
};

exports.down = function (knex) {
  return knex.schema.dropTable("user_logins");
};
