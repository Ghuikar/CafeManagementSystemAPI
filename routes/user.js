const express = require("express");
const connection = require("../connection");
require("dotenv").config();
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");

const auth = require("../services/authentication"); // Adjust the path as needed
const checkRole = require("../services/checkRole"); // Adjust the path as needed

const router = express.Router();

router.get("/getUsers", auth, checkRole, (req, res) => {
  const query = "SELECT * FROM user"; // Adjust table name if necessary

  connection.query(query, (err, results) => {
    if (err) {
      console.error("Error fetching users:", err);
      return res.status(500).json({ message: "Internal server error" });
    }

    res.status(200).json(results);
  });
});

router.post("/signup", (req, res) => {
  const { contactnumber, email, password, status, role } = req.body;

  if (!contactnumber || !email || !password || status === undefined || !role) {
    return res
      .status(400)
      .send("All fields are required and should be correctly spelled");
  }

  const query =
    "SELECT status, password, email, role FROM user WHERE email = ?";

  connection.query(query, [email], (err, results) => {
    if (!err) {
      if (results.length == 0) {
        const query =
          "INSERT INTO user (contactnumber, email, password, status, role, created_at) VALUES (?, ?, ?, ?, ?, NOW())";
        connection.query(
          query,
          [contactnumber, email, password, status, role],
          (err, result) => {
            if (!err) {
              res.status(201).send("User created successfully");
            } else {
              res.status(500).send(err);
            }
          }
        );
      } else {
        res.status(400).send("Email Already Exists");
      }
    } else {
      res.status(500).send(err);
    }
  });
});

router.post("/login", (req, res) => {
  const { email, password } = req.body;
  const query = "SELECT email,password, role,status FROM user WHERE email = ?";

  connection.query(query, [email], (err, results) => {
    if (results == 0 || results[0].password !== password) {
      res.status(401).json({ message: "invalid username or password" });
    } else if (results[0].status == "false") {
      res.status(401).json({ message: "wait for Admin Approval" });
    } else if (results[0].password == password) {
      const payload = {
        email: email,
        password: password,
        role: results[0].role,
      };

      const accessToken = jwt.sign(payload, process.env.ACCESS_TOKEN);
      res.status(200).json({ token: accessToken });
    }
  });
});

// Create a transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER, // Your email address
    pass: process.env.EMAIL_PASS, // Your email password or app-specific password
  },
});

router.post("/forget-password", (req, res) => {
  const { email } = req.body;

  const query = "SELECT email,password, role,status FROM user WHERE email = ?";

  connection.query(query, [email], (err, result) => {
    console.log("result", result);
    if (result.length == 0) {
      res.status(200).json({ message: "User does not exist" });
    } else {
      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: "Login Crediantials",
        text: `You requested a password. Click the link to reset your password: `,
        html:
          `<p>You requested for a password .Your password:</p> ` +
          result[0].password,
      };

      transporter.sendMail(mailOptions, (err, info) => {
        if (err) {
          console.error("Error sending email:", err);
          return res.status(500).json({ error: "Error sending email" });
        }

        res.status(200).json({ message: "Password sent" });
      });
    }
  });
});

router.get("/get", (req, res) => {
  const query =
    "Select contactnumber, email, password, status, role FROM user WHERE role='user' ";
  connection.query(query, (err, result) => {
    console.log("result", result);
    res.status(200).json({ Users: result });
  });
});

router.patch("/updatePassword", (req, res) => {
  const { email, password } = req.body;

  const query = "UPDATE user SET password=? WHERE email=?";
  connection.query(query, [password, email], (err, result) => {
    console.log("result", result);
    if (result) {
      res.status(200).json({ message: "password Updated Sucessfully" });
    } else {
      res.status(500).json({ ERROR: err });
    }
  });
});

router.patch("/updateStatus", auth, checkRole, (req, res) => {
  const { email, status } = req.body;

  const query = "UPDATE user SET status=? WHERE email=?";
  connection.query(query, [status, email], (err, result) => {
    if (!err) {
      if (result.affectedRows == 0) {
        res
          .status(400)
          .json({ message: "user does not exist, that is no rows affected" });
      } else {
        res.status(200).json({ message: "Status Updated Sucessfully", result });
      }
    } else {
      res.status(500).json({ ERROR: err });
    }
  });
});

// router.post("/changePassword", auth, (req, res) => {
//   console.log("res", res.locals);
// });

router.post("/changePassword", auth, async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  const user = res.locals; // Assuming you have user id stored in JWT

  if (!currentPassword || !newPassword) {
    return res
      .status(400)
      .json({ message: "Current password and new password are required" });
  }

  // Fetch the user from the database
  const query = "SELECT password FROM user WHERE email = ?";
  connection.query(query, [user.email], (err, results) => {
    console.log("results", results);
    if (err) {
      return res
        .status(500)
        .json({ message: "Database query error", error: err });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.password == currentPassword) {
      const updateQuery = "UPDATE user SET password = ? WHERE email = ?";
      connection.query(updateQuery, [newPassword, user.email], (updateErr) => {
        if (!updateErr) {
          res.status(200).json({ message: "password updated successfully" });
        } else {
          res.status(500).json({ Error: updateErr });
        }
      });
    }
  });
});

module.exports = router;
