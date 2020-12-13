//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const lodash = require("lodash");

const mongoose = require('mongoose');

const session = require('express-session');
const passport = require("passport");

const cors = require('cors');
require('dotenv').config();
const path = require('path');

const app = express();
const port = process.env.PORT || 5000;

app.use(bodyParser.urlencoded({extended: true}));

app.use(express.static(path.join(__dirname, "../teamder/build")));

// app.use(
//   cors({
//     origin: "https://teamder-app.herokuapp.com", // allow to server to accept request from different origin
//     methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
//     credentials: true // allow session cookie from browser to pass through
//   })
// );
// Set up sessions
app.use(session({
    secret: "The Tinder for Techies.",
    resave: false,
    saveUninitialized: false
  }));
  
  app.use(passport.initialize());
  app.use(passport.session());

// Session setup complete






// mongoDB Connection
const MONGODB_URI = `mongodb+srv://team-epic:${process.env.MONGO_PASSWORD}@cluster0.l7m6u.mongodb.net/Teamder?retryWrites=true&w=majority`;
mongoose.connect(MONGODB_URI, {useNewUrlParser: true, useUnifiedTopology: true});
mongoose.set("useCreateIndex", true);
const connection = mongoose.connection;
connection.once('open', () => {
    console.log("MongoDB database connection established successfully");
});
// mongoDB connection finished
const updateHackathon = require('./routes/Hackathon/updateHackathon');
updateHackathon();
setInterval(updateHackathon, 43200000); // every 12 hours


const User = require("./models/profileModel");
passport.use(User.createStrategy());

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
    done(err, user);
  });
});

/*Routes Config*/

const indexRoute = require("./routes/index");
const loginRoute = require("./routes/login");
const registerRoute = require("./routes/register");
const googleAuth = require("./routes/googleAuth");
const githubAuth = require("./routes/githubAuth");
const editProfile = require("./routes/editProfile");
const getAllData = require('./routes/getAllData');
const getUserData = require('./routes/getUserData');
const isLoggedIn = require('./routes/isLoggedin');
const similarUsers = require('./routes/ML/similarusers');
const hackathons = require('./routes/getHackathons');
const myHackathons = require('./routes/getMyHackathons');
const addHackathon = require('./routes/addMyHackathon');
const createNewChat = require('./routes/createNewChat');
const updateChat = require('./routes/updateChat');
const getChats = require('./routes/getChats');
const getCurrentChat = require('./routes/getCurrentChat');
const getProfilePictures = require('./routes/getProfilePictures');
const { Schema } = require("mongoose");

/*-----Routes Config End------*/


/*App Config*/

app.use("/api",indexRoute);
app.use("/api/login",loginRoute);
app.use("/api/register",registerRoute);
app.use("/api/auth/google", googleAuth);
app.use("/api/auth/github", githubAuth);
app.use("/api/profile/edit", editProfile);
app.use("/api/getalldata", getAllData);
app.use("/api/getuserdata",getUserData);
app.use("/api/loggedin", isLoggedIn);
app.use("/api/similarusers", similarUsers);
app.use("/api/hackathons", hackathons);
app.use("/api/myhackathons", myHackathons);
app.use("/api/addmyhackathon", addHackathon);
app.use("/api/newchat",createNewChat);
app.use("/api/updatechat", updateChat);
app.use("/api/getchats", getChats);
app.use("/api/getcurrentchat", getCurrentChat);
app.use("/api/getprofilepictures", getProfilePictures);

/*------App Config End--------*/

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname + "../teamder/build/index.html"));
  });

app.listen(port, function(){
    console.log("Server started locally at port 5000");
});

