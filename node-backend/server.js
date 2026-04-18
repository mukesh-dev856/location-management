const express = require("express");
const cors = require("cors");
const app = express();
require("dotenv").config();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
const authRoutes = require("./src/routes/authRoutes");
const stateRoutes = require("./src/routes/state");
const cityRoutes = require("./src/routes/city");

app.use("/api/auth", authRoutes);
app.use("/api/states", stateRoutes);
app.use("/api/cities", cityRoutes);

app.get("/", (req, res) => {
  res.send("API Running...");
});

// Error Handling Middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    status: false,
    message: "Something went wrong!",
    error: process.env.NODE_ENV === "development" ? err.message : undefined,
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});