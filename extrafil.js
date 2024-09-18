const express = require("express");
const path = require("path");
const bcrypt = require("bcrypt");
// const path = require ("path")
const mongodb = require("mongodb");
const mongoose = require("mongoose");
const {
  signupschemas,
} = require("/Users/shivam/Desktop/nodejs/Authentication and authourisation/Modal/db.js");
const { sign } = require("crypto");

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
    res.json("user signed up succesfully");
  }
});

app.post("/login", async (req, res) => {
  try {
    console.log("error 0");
    const check = await signupschemas.findOne({
      Email: req.body.Email,
    });
    console.log("error is here at pass check 0");

    if (!check) {
      console.log("error is here at pass check 1");
      res.json("user not found");
      console.log("error is here at pass check 2");
    }
    const passcheck = await signupschemas.findOne({
      Password: req.body.Password,
    });
    console.log("error is here at bcrypt line 3");
    if (!passcheck) {
      console.log("error is here at pass check 4");
      res.json("Password not matched");
    } else if ((check.Email, check.Password)) {
      res.json("You pass are logged in");
    }

    // if (!user.Password) {
    //   res.json("pass not matched");
    // }
    // console.log("error 0.2");
  } catch {}
});
app.listen(port);

//       console.log("error is here at pass check 4");
//       console.log("okay working");
