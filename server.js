require("dotenv").config();
const http = require("http");
const app = require("./index");

const path=require('path')
const server = http.createServer(app);



server.listen(process.env.PORT, () => {
  console.log("Server Started at PORT:", `${process.env.PORT}`);
});


