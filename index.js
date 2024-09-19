const express = require("express");
const path = require("path");
const bcrypt = require("bcrypt");
// const path = require ("path")
const mongodb = require("mongodb");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
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
      msg: "user signed up succesfully",
    });
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
    const passcheck = await bcrypt.compare(req.body.Password, check.Password);
    console.log("error is here at bcrypt line 3");
    if (passcheck) {
      console.log("error is here at pass check 4");
      res.json("Passwordmatched");
    } else {
      res.json("pass not matched");
    }
  } catch {}
});

function middle(req, res, next) {
  //if login
  // next()
}

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
      res.json({ msg: "good bye" });
    } else if ((check.Email, check.Password)) {
      res.json("You pass are logged in");
    }
  } catch {}
});

//geting by username

////////////////////////////////////////////////////

// Crud for Blogs
// get all blogs

app.get("/", async (req, res) => {
  const allblogs = await BlogsModel.find();
  res.json({ msg: "all blogs are here", data: allblogs });
});

// post blog

app.post("/login/blog", middle, async (req, res) => {
  const Yourblog = await BlogsModel.create({
    Blog_Title: req.body.Blog_Title,
    Blog_Post: req.body.Blog_Post,
  });
  res.json({ msg: " The blog is submitted", Yourblog });
});

//updateblog

app.get("/:Id", async (req, res) => {
  const id = req.params.Id;
  const findblog = await BlogsModel.findOne({ _id: id });
  res.json({ msg: " The blog with the id is here : ", findblog });
});

app.patch("/:Id", async (req, res) => {
  const id = req.params.Id;
  const updatedblog = await BlogsModel.updateOne(
    { _id: id },
    {
      Blog_Title: req.body.Blog_Title,
      Blog_post: req.body.Blog_Post,
    }
  );
  res.json({ msg: " Here is the updated blog : ", updatedblog });
});

app.delete("/:Id", async (req, res) => {
  const id = req.params.Id;
  const deletedblog = await BlogsModel.deleteOne(
    { _id: id },
    { Blog_Title: req.body.Blog_Title, Blog_Post: req.body.Blog_Post }
  );
  res.json({ msg: "The blog is deleted :", deletedblog });
});

app.listen(port);
