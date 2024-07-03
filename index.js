const express = require("express");
const cors = require("cors");
const app = express();
app.set("view engine","ejs")
const connection = require("./connection");

const userRoute = require("./routes/user");
const categoryRoute = require("./routes/category");
const productsRoute=require('./routes/products')
const billRoute=require('./routes/bill')
const dashboardRoute=require('./routes/dashboard')
app.use(cors());

// Parse URL-encoded bodies (as sent by HTML forms)
app.use(express.urlencoded({ extended: true }));

// Parse JSON bodies (as sent by API clients)
app.use(express.json());



app.use("/user", userRoute);
app.use("/category", categoryRoute);
app.use("/products", productsRoute);
app.use("/bill",billRoute)
app.use("/dashboardRoute",dashboardRoute)

module.exports = app;
