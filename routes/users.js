// const express = require("express");
// const router = express.Router();
// const db = require("../db");
// const bcrypt = require("bcrypt");

// // ================= REGISTER =================

// router.post("/register", async (req, res) => {
//   const { name, email, password } = req.body;

//   try {
//     const hashedPassword = await bcrypt.hash(password, 10);

//     const sql =
//       "INSERT INTO users (name, email, password) VALUES (?, ?, ?)";

//     db.query(sql, [name, email, hashedPassword], (err, result) => {
//       if (err) {
//         console.log(err);

//         return res.status(500).json({
//           message: "Registration Failed",
//         });
//       }

//       res.json({
//         message: "User Registered Successfully",
//       });
//     });

//   } catch (err) {
//     console.log(err);

//     res.status(500).json({
//       message: "Server Error",
//     });
//   }
// });

// // ================= LOGIN =================

// router.post("/login", (req, res) => {
//   const { email, password } = req.body;

//   const sql = "SELECT * FROM users WHERE email=?";

//   db.query(sql, [email], async (err, result) => {

//     if (err) {
//       console.log(err);

//       return res.status(500).json({
//         message: "Database Error",
//       });
//     }

//     if (result.length === 0) {
//       return res.status(401).json({
//         message: "User Not Found",
//       });
//     }

//     const user = result[0];

//     const validPassword = await bcrypt.compare(
//       password,
//       user.password
//     );

//     if (!validPassword) {
//       return res.status(401).json({
//         message: "Invalid Password",
//       });
//     }

//     res.json({
//       message: "Login Successful",
//       user: {
//         id: user.id,
//         name: user.name,
//         email: user.email,
//       },
//     });

//   });
// });

// // ================= GET ALL USERS =================

// router.get("/", (req, res) => {

//   const sql =
//     "SELECT id, name, email, created_at FROM users ORDER BY id DESC";

//   db.query(sql, (err, result) => {

//     if (err) {
//       console.log(err);

//       return res.status(500).json({
//         message: "Database Error",
//       });
//     }

//     res.json(result);

//   });

// });

// module.exports = router;



const express = require("express");
const router = express.Router();
const db = require("../db");
const bcrypt = require("bcrypt");

// GET ALL USERS
router.get("/", (req, res) => {
  const sql = `
    SELECT id, name, email, created_at
    FROM users
    ORDER BY id DESC
  `;

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

// REGISTER
router.post("/register", async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const sql =
      "INSERT INTO users (name,email,password) VALUES (?,?,?)";

    db.query(sql, [name, email, hashedPassword], (err) => {
      if (err) {
        console.log(err);
        return res.status(500).json({
          message: "Registration Failed",
        });
      }

      res.json({
        message: "User Registered Successfully",
      });
    });

  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Server Error",
    });
  }
});

// LOGIN
router.post("/login", (req, res) => {
  const { email, password } = req.body;

  db.query(
    "SELECT * FROM users WHERE email=?",
    [email],
    async (err, result) => {
      if (err) {
        console.log(err);
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

      const valid = await bcrypt.compare(
        password,
        user.password
      );

      if (!valid) {
        return res.status(401).json({
          message: "Invalid Password",
        });
      }

      res.json({
        message: "Login Successful",
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
        },
      });
    }
  );
});

module.exports = router;