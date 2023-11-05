//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require("lodash");
const mongoose=require("mongoose");

const homeStartingContent = "Welcome to DAILY JOURNAL";
const aboutContent = "Welcome to Daily Journal, where passion meets purpose. We're more than just a blog; we're a community of curious minds, dedicated to sharing knowledge and inspiration with the world.";
const contactContent = "We value your feedback, questions, and ideas. Your input is essential in helping me improve and better serve your needs. Feel free to reach out to us through the following channels:";
 
const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

//Connecting mongodb server using mongoose
mongoose.connect(process.env.MONGODB_URI, {
  serverSelectionTimeoutMS: 5000,
});

//Creating collections
const blogSchema=new mongoose.Schema({
  title:String,
  content: String,
});

const Post=mongoose.model("Post", blogSchema);

app.get("/", (req,res)=>{
  Post.find({})
    .then((posts) => {
      res.render("home.ejs", {
        homeStartingContent: homeStartingContent,
        posts: posts,
      });
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("An error occurred");
    });
});

app.get("/about", (req,res)=>{
  res.render("about.ejs", {aboutContent});
});

app.get("/contact", (req,res)=>{
  res.render("contact.ejs", {contactContent});
});

app.get("/compose", (req,res)=>{
  res.render("compose.ejs");
});

app.post("/compose", (req,res)=>{
  const blog=new Post({
    title: req.body.blogTitle,
    content: req.body.blog
  });
  
  blog
  .save()
  .then(() => {
    res.redirect("/");
  })
  .catch((err) => {
    console.error(err);
    // Handle any potential errors here
    res.status(500).send("An error occurred");
  });
  
  
});

app.get("/posts/:postId", (req,res)=>{
  const requestedPostId = req.params.postId;
  
  Post.findOne({ _id: requestedPostId })
  .then((post) => {
    if (post) {
      res.render("post.ejs", {
        post:post,
      });
    } else {
      console.log("Post not found.");
      res.status(404).send("Post not found");
    }
  })
  .catch((err) => {
    console.error(err);
    res.status(500).send("An error occurred");
  });
});

app.listen(3000, function() {
  console.log("Server started on port 3000");
});
