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

exports.seed = async function (knex) {
  // Deletes ALL existing entries
  await knex("user_logins").del();
  await knex("user_logins").insert(usersData);
};
