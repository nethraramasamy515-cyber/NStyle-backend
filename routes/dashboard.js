const express = require("express");
const router = express.Router();
const db = require("../db");

router.get("/", (req, res) => {
  const dashboard = {};

  db.query(
    "SELECT COUNT(*) AS totalProducts FROM products",
    (err, products) => {
      if (err) return res.status(500).json(err);

      dashboard.totalProducts = products[0].totalProducts;

      db.query(
        "SELECT COUNT(*) AS totalUsers FROM users",
        (err, users) => {
          if (err) return res.status(500).json(err);

          dashboard.totalUsers = users[0].totalUsers;

          db.query(
            "SELECT COUNT(*) AS totalOrders FROM orders",
            (err, orders) => {
              if (err) return res.status(500).json(err);

              dashboard.totalOrders = orders[0].totalOrders;

              db.query(
                "SELECT IFNULL(SUM(total_price),0) AS revenue FROM orders",
                (err, revenue) => {
                  if (err) return res.status(500).json(err);

                  dashboard.revenue = revenue[0].revenue;

                  res.json(dashboard);
                }
              );
            }
          );
        }
      );
    }
  );
});

module.exports = router;