const express = require("express");
const router = express.Router();
const db = require("../db");

router.post("/", (req, res) => {
  const {
    user_name,
    email,
    product_name,
    quantity,
    total_price,
    payment_method,
  } = req.body;

  const sql = `
    INSERT INTO orders
    (user_name, email, product_name, quantity, total_price, payment_method, status)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `;

  db.query(
    sql,
    [
      user_name,
      email,
      product_name,
      quantity,
      total_price,
      payment_method,
      "Pending",
    ],
    (err, result) => {
      if (err) {
        console.log(err);
        return res.status(500).json({
          message: "Failed to create order",
        });
      }

      res.json({
        message: "Order Created Successfully",
        orderId: result.insertId,
      });
    }
  );
});

router.get("/", (req, res) => {
  const sql = "SELECT * FROM orders ORDER BY id DESC";

  db.query(sql, (err, result) => {
    if (err) {
      console.log(err);
      return res.status(500).json({
        message: "Database Error",
      });
    }

    res.json(result);
  });
});

router.get("/:id", (req, res) => {
  const { id } = req.params;

  db.query(
    "SELECT * FROM orders WHERE id = ?",
    [id],
    (err, result) => {
      if (err) {
        console.log(err);
        return res.status(500).json({
          message: "Database Error",
        });
      }

      if (result.length === 0) {
        return res.status(404).json({
          message: "Order Not Found",
        });
      }

      res.json(result[0]);
    }
  );
});

router.put("/:id", (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  const allowedStatuses = [
    "Pending",
    "Packed",
    "Shipped",
    "Out for Delivery",
    "Delivered",
    "Cancelled",
  ];

  if (!allowedStatuses.includes(status)) {
    return res.status(400).json({
      message: "Invalid Order Status",
    });
  }

  db.query(
    "UPDATE orders SET status = ? WHERE id = ?",
    [status, id],
    (err, result) => {
      if (err) {
        console.log(err);
        return res.status(500).json({
          message: "Failed to Update Order",
        });
      }

      if (result.affectedRows === 0) {
        return res.status(404).json({
          message: "Order Not Found",
        });
      }

      res.json({
        message: "Order Status Updated Successfully",
      });
    }
  );
});

router.delete("/:id", (req, res) => {
  const { id } = req.params;

  db.query(
    "DELETE FROM orders WHERE id = ?",
    [id],
    (err, result) => {
      if (err) {
        console.log(err);
        return res.status(500).json({
          message: "Failed to Delete Order",
        });
      }

      if (result.affectedRows === 0) {
        return res.status(404).json({
          message: "Order Not Found",
        });
      }

      res.json({
        message: "Order Deleted Successfully",
      });
    }
  );
});

module.exports = router;