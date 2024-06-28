const express = require("express");
const cors = require("cors");
const app = express();
const connection = require("./connection");

const userRoute = require("./routes/user");
const categoryRoute = require("./routes/category");
const productsRoute=require('./routes/products')
app.use(cors());

// Parse URL-encoded bodies (as sent by HTML forms)
app.use(express.urlencoded({ extended: true }));

// Parse JSON bodies (as sent by API clients)
app.use(express.json());


app.use("/user", userRoute);
app.use("/category", categoryRoute);
app.use("/products", productsRoute);

module.exports = app;
