const express = require("express");
const router = express.Router();
const db = require("../db");
const bcrypt = require("bcrypt");

// =====================================================
// GET ALL USERS
// =====================================================

router.get("/", (req, res) => {
  const sql = `
    SELECT id, name, email, role, created_at
    FROM users
    ORDER BY id DESC
  `;

  db.query(sql, (err, result) => {
    if (err) {
      console.log("GET USERS ERROR:", err);

      return res.status(500).json({
        message: "Database Error",
      });
    }

    res.json(result);
  });
});

// =====================================================
// REGISTER
// =====================================================

router.post("/register", async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({
      message: "Please fill all fields",
    });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const sql = `
      INSERT INTO users
      (name, email, password, role)
      VALUES (?, ?, ?, 'user')
    `;

    db.query(
      sql,
      [name, email, hashedPassword],
      (err, result) => {
        if (err) {
          console.log("REGISTER ERROR:", err);

          // Duplicate email
          if (err.code === "ER_DUP_ENTRY") {
            return res.status(409).json({
              message: "Email already registered",
            });
          }

          return res.status(500).json({
            message: "Registration Failed",
          });
        }

        res.status(201).json({
          message: "User Registered Successfully",
          userId: result.insertId,
        });
      }
    );

  } catch (err) {
    console.log("REGISTER SERVER ERROR:", err);

    res.status(500).json({
      message: "Server Error",
    });
  }
});

// =====================================================
// LOGIN
// =====================================================

router.post("/login", (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      message: "Email and password are required",
    });
  }

  const sql = `
    SELECT id, name, email, password, role
    FROM users
    WHERE email = ?
  `;

  db.query(
    sql,
    [email],
    async (err, result) => {
      if (err) {
        console.log("LOGIN DATABASE ERROR:", err);

        return res.status(500).json({
          message: "Database Error",
        });
      }

      if (result.length === 0) {
        return res.status(401).json({
          message: "User Not Found",
        });
      }

      const user = result[0];

      try {
        const valid = await bcrypt.compare(
          password,
          user.password
        );

        if (!valid) {
          return res.status(401).json({
            message: "Invalid Password",
          });
        }

        // IMPORTANT:
        // Send role to frontend
        res.json({
          message: "Login Successful",

          user: {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
          },
        });

      } catch (error) {
        console.log("PASSWORD CHECK ERROR:", error);

        return res.status(500).json({
          message: "Server Error",
        });
      }
    }
  );
});

module.exports = router;