const express = require("express");
const router = express.Router();
const db = require("../db");

// ===============================
// GET ALL PRODUCTS
// ===============================
router.get("/", (req, res) => {
  const sql = "SELECT * FROM products";

  db.query(sql, (err, result) => {
    if (err) {
      console.error("❌ PRODUCT DATABASE ERROR:");
      console.error(err);

      return res.status(500).json({
        message: "Database Error",
        error: err.message,
        code: err.code,
      });
    }

    console.log("✅ Products loaded:", result.length);

    res.json(result);
  });
});

// ===============================
// ADD PRODUCT
// ===============================
router.post("/", (req, res) => {
  const { name, price, category, rating, image } = req.body;

  const sql = `
    INSERT INTO products
    (name, price, category, rating, image)
    VALUES (?, ?, ?, ?, ?)
  `;

  db.query(
    sql,
    [name, price, category, rating, image],
    (err, result) => {
      if (err) {
        console.error("❌ ADD PRODUCT ERROR:");
        console.error(err);

        return res.status(500).json({
          message: "Database Error",
          error: err.message,
          code: err.code,
        });
      }

      res.json({
        message: "Product Added Successfully",
      });
    }
  );
});

// ===============================
// DELETE PRODUCT
// ===============================
router.delete("/:id", (req, res) => {
  const { id } = req.params;

  const sql = "DELETE FROM products WHERE id=?";

  db.query(sql, [id], (err, result) => {
    if (err) {
      console.error("❌ DELETE PRODUCT ERROR:");
      console.error(err);

      return res.status(500).json({
        message: "Database Error",
        error: err.message,
        code: err.code,
      });
    }

    res.json({
      message: "Product Deleted Successfully",
    });
  });
});

// ===============================
// UPDATE PRODUCT
// ===============================
router.put("/:id", (req, res) => {
  const { id } = req.params;
  const { name, price, category, rating, image } = req.body;

  const sql = `
    UPDATE products
    SET
      name=?,
      price=?,
      category=?,
      rating=?,
      image=?
    WHERE id=?
  `;

  db.query(
    sql,
    [name, price, category, rating, image, id],
    (err, result) => {
      if (err) {
        console.error("❌ UPDATE PRODUCT ERROR:");
        console.error(err);

        return res.status(500).json({
          message: "Database Error",
          error: err.message,
          code: err.code,
        });
      }

      res.json({
        message: "Product Updated Successfully",
      });
    }
  );
});

module.exports = router;