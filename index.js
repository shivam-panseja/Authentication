const express = require("express");
const path = require("path");
const bcrypt = require("bcrypt");
// const path = require ("path")
const mongodb = require("mongodb");
const mongoose = require("mongoose");
const {
  signupschemas,
} = require("/Users/shivam/Desktop/nodejs/Authentication and authourisation/Modal/db.js");

mongoose.connect(
  "mongodb+srv://Loggin:DvtVlDMvlyloAjPm@loggin.zcooa.mongodb.net/?retryWrites=true&w=majority&appName=Loggin"
);
mongoose.connection.on("connected", () => {
  console.log("database is connected");
});

const app = express();
app.use(express.json());
const port = 4000;

// for signup
app.post("/signup", async (req, res) => {
  const user = req.body;
  const registeduser = await signupschemas.create({
    Name: user.Name,
    Email: user.Email,
    Password: user.Password,
  });

  console.log("working");
  res.json({ msg: "this is working : ", registeduser });
});

app.get("/loggin", async (req, res) => {
  const getting = await signupschemas.find();
  res.json(getting);
});

app.post("/loggin", async (req, res) => {
  const logginn = req.body;
  const registeduser = await signupschemas.findOne({
    Email: logginn.Email,
    // Password: logginn.Password,
  });

  console.log("working");
  res.json({ msg: "this is working : ", logginn });
});

app.listen(port, () => {
  console.log("Server is running on port 4000");
});
