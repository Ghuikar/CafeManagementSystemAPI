const jwt = require("jsonwebtoken");
require("dotenv").config();

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  console.log("authHeader",authHeader);
  const token = authHeader && authHeader.split(" ")[1];

  if (token == null) {
    return res.status(401).json({ message: "Token is missing" });
  }

  jwt.verify(token, process.env.ACCESS_TOKEN, (err, user) => {
    console.log("user",user)
    if (err) {
      return res.status(403 ).json({ message: "Token is invalid or expired" });
    }
    res.locals = user;
    next();
  });

};

module.exports = authenticateToken;
