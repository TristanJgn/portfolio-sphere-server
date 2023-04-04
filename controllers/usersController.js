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

    return res
    .status(201)
    .json({
      message: "New account successfully created",
      token,
    });
  }  
};


exports.login = (req, res) => {
  const { email, password } = req.body;

  // Check the request has the required fields
  if (!email || !password) {
    return res
      .status(400)
      .json({ error: "Login requires email and password fields" });
  }

  // Find user by email
  knex("users")
    .where({ email: email })
    .then(users => {
        if (users.length !== 1) {
            return res.status(401).json({
                error: "Invalid login credentials"
            })
        }

        // If email matches a record, then we will have found our user
        const foundUser = users[0];
        // We then need to compare the user's password to their hashed password in the database which will require bcrypt
        const isValidPassword = bcrypt.compareSync(password, foundUser.password)

        if (!isValidPassword) {
            return res.status(401).json({
                error: "Invalid login credentials"
            })
        }

        // Reaching this code means we have valid login credentials so a JWT can now be created and sent back to the client
        const token = jwt.sign({ id: foundUser.id }, process.env.JWT_SECRET_KEY);
    
        res.json({
            message: "Successfully logged in",
            token,
        })
    })
};