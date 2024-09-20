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
      const token = jwt.sign(
        { Email: check.Email },
        "shivam",
        { expiresIn: "5m" } // expires in 24 hours
      );
      console.log("5555555%%%%%%%%%%555555555");
      // req.token = token;
      res.json({ token });

      console.log("ethe aa main");
    } else {
      res.json("pass not matched");
    }
  } catch {}
});

app.post("/logout", verifyToken, (req, res) => {
  try {
    console.log("inside logout route");
    const token = req.token;
    const email = req.user;
    console.log("token", token);

    const data = jwt.sign({ email }, "shivam", { expiresIn: 1 });
    res.json({ msg: "logged out" });
  } catch (e) {
    throw new Error(e);
  }
});

async function verifyToken(req, res, next) {
  console.log("inside middleqware");
  const bearerHeader = req.headers["authorization"];
  if (typeof bearerHeader !== "undefined") {
    console.log("inside beare token exists");
    const bearer = bearerHeader.split(" ");
    const token = bearer[1];
    console.log("tooken data", token);

    const data = jwt.verify(token, "shivam");
    console.log("after verify user");
    const user = await signupschemas.findOne({ Email: data.Email });
    if (!user) {
      console.log("inside user does not exists");
      throw new Error();
    }
    req.token = token;
    req.user = data.Email;
    next();
  } else {
    res.send({ result: "token is not valid" });
    // next();
  }
  // res.json({ msg: " hello this is from token verification" });
}

app.listen(port);
