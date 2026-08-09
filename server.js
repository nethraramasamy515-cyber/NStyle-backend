const express = require("express");
const cors = require("cors");
require("dotenv").config();

const db = require("./db");
const productRoutes = require("./routes/products");
const userRoutes = require("./routes/users");
const app = express();
const orderRoutes = require("./routes/orders");
const dashboardRoutes = require("./routes/dashboard");
app.use(cors());
app.use(express.json());

// Product Routes
app.use("/api/products", productRoutes);
app.use("/api/users", userRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/dashboard", dashboardRoutes);
// Home Route
app.get("/", (req, res) => {
  res.send("🚀 NStyle Backend Running");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});