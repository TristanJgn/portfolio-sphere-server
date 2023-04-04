require("dotenv").config();
const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  const bearerTokenString = req.headers.authorization;

  // Check that a bearer token is being passed with the request
  if (!bearerTokenString) {
    return res.status(401).json({
      error: "Resource requires Bearer token in Authorization header",
    });
  }

  // Separate the string into "Bearer" and the actual JWT token
  const splitBearerToken = bearerTokenString.split(" ");

  // The token should only have the two parts otherwise it is malformed
  if (splitBearerToken.length !== 2) {
    return res.status(400).json({
      error: "Bearer token is malformed",
    });
  }

  // Verify the token has a valid signature
  const token = splitBearerToken[1];

  jwt.verify(token, process.env.JWT_SECRET_KEY, (err, decoded) => {
    if (err) {
      return res.status(403).json({
        error: "Invalid JWT",
      });
    }

    // Return the user ID which can be used for the given route's operations
    req.userId = decoded.id;
    next();
  });
};
