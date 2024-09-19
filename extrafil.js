const express = require("express");
const path = require("path");
const bcrypt = require("bcrypt");
// const path = require ("path")
const mongodb = require("mongodb");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const secretKey = "secretkey";

const {
  signupschemas,
  BlogsModel,
} = require("/Users/shivam/Desktop/nodejs/Authentication and authourisation/Modal/db.js");
const { sign } = require("crypto");
const { JsonWebTokenError } = require("jsonwebtoken");

mongoose.connect(
  "mongodb+srv://Loggin:DvtVlDMvlyloAjPm@loggin.zcooa.mongodb.net/?retryWrites=true&w=majority&appName=Loggin"
);
mongoose.connection.on("connected", () => {
  console.log("database is connected");
});

const app = express();
app.use(express.json());
const port = 4000;

app.post("/signup", async (req, res) => {
  const user = {
    Name: req.body.Name,
    Email: req.body.Email,
    Password: req.body.Password,
  };
  const userexists = await signupschemas.findOne({ Email: req.body.Email });
  if (userexists) {
    res.json("user already exists");
  } else {
    const saltRound = 10;
    const hashpass = await bcrypt.hash(req.body.Password, saltRound);
    user.Password = hashpass;
    const newuser = await signupschemas.create(user);
    res.json({
      msg: "user signed up succesfully :",
    });
  }
});

app.post("/login", async (req, res) => {
  try {
    console.log("error 0");
    const check = await signupschemas.findOne({
      Email: req.body.Email,
    });
    console.log("000000 0");

    if (!check) {
      console.log("1111111111");
      res.json("user not found");
      console.log("22222222222 2");
    }
    const passcheck = await bcrypt.compare(req.body.Password, check.Password);
    console.log("333333333333333333 3");
    if (passcheck) {
      console.log("44444444444$$$$$$$$$$$ 4");
      //   res.json("here is me ");

      //   next(); ///here i have mentioned change
      const token = jwt.sign({ Email: user.Email }, "shivam", {
        expiresIn: "5m",
      });
      console.log("5555555%%%%%%%%%%555555555");
      res.json({ token });

      console.log("ethe aa main");
    } else {
      res.json("pass not matched");
    }
  } catch {}
});

app.listen(port);
