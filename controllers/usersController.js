const knex = require("knex")(require("../knexfile"));
const bcrypt = require("bcrypt");
require("dotenv").config();
const jwt = require("jsonwebtoken");
const { v4: uuidv4 } = require("uuid");

exports.register = async (req, res) => {
  const { email, password } = req.body;

  // Check the request has the required fields
  if (!email || !password) {
    return res
      .status(400)
      .json({ error: "Registration requires email and password fields" });
  }

  // Check that an account with the same email does not already exist
  const existingUser = await knex("users").where({ email: email });

  if (existingUser.length === 1) {
    return res
      .status(400)
      .json({ error: "An account with this email already exists" });
  }

  // If the email is new, then proceed with the registration process
  const hashedPassword = bcrypt.hashSync(
    password,
    Number(process.env.BCRYPT_SALT_ROUNDS)
  );

  const newUserId = uuidv4();

  await knex("users").insert({
    id: newUserId,
    email,
    password: hashedPassword,
  });
 
  // Check that the new email exists in the database to confirm the user information was successfully entered into the table
  const createdUser = await knex("users").where({ email: email });

  if (createdUser.length === 1) {
    // Generate a token on successful registration so the user can start using the site without needing to login right after
    const token = jwt.sign({ id: createdUser[0].id }, process.env.JWT_SECRET_KEY); 

    return res.json({
      message: "New account successfully created",
      token,
    });
  }  
};
