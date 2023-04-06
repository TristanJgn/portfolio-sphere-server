// Add dependencies
const express = require("express");
const cors = require("cors");
require("dotenv").config();
const coinsRoutes = require("./routes/coinsRoute");
const usersRoutes = require("./routes/usersRoute");
const portfolioRoutes = require("./routes/portfolioRoute");
const dashboardRoutes = require("./routes/dashboardRoute");

// Create an instance of express
const app = express();

// Define variables
const PORT = process.env.PORT || 8000;

// Add middleware
app.use(cors());
app.use(express.json());

// Define routes
app.use("/coins", coinsRoutes);
app.use("/users", usersRoutes);
app.use("/portfolio", portfolioRoutes);
app.use("/dashboard", dashboardRoutes);

// Bootstrap server
app.listen(PORT, () => {
  console.log(`listening on port ${PORT}`);
});
