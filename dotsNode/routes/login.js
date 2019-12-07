// REQUIRE APP AND GENERAL FUNCTIONS
var app = require('../server');
var ObjectId = require('mongodb').ObjectID;

// Mongoose
var mongoose = require('mongoose');
var dbConnectionSettings = require('../dbConnectionSettings');
const baseUrl = dbConnectionSettings.baseUrl; // require base url of the database
const connectParams = dbConnectionSettings.connectParams; // require base url of the database

// Require bcrypt for hashing passwords
const bcrypt = require('bcrypt');
const saltRounds = 10;

var User = require('../schemas/userSchema');
//
// app.get("/login", function(req, res){
//   if(req.cookies.DotsUserId != null){
//     res.redirect('/home');
//   }
//   else{
//     res.render("login");
//   }
// })
//
// app.post("/login", function(req, res){
//   var userData = req.body;
//   console.log(userData);
//
//   mongoose.connect(baseUrl, connectParams, function (err) {
//     if(err) throw err;
//
//     User.findOne({ Username: userData.Username })
//     .exec(function(err, user){
//       if(err) throw err;
//
//       console.log(user);
//
//       if(user == null){
//         res.send("UsernameNotFound");
//       }
//       else{
//         bcrypt.compare(userData.Password, user.Password, function (err, result) {
//           if (result === true) {
//
//             var hour = 3600000;
//             res.cookie('DotsUsername', user.Username, {maxAge: 14*24*hour}); // 2 weeks
//             res.cookie('DotsUserId', user.id, {maxAge: 14*24*hour}); // 2 weeks
//
//             res.send("LoggedIn");
//           }
//           else{
//             res.send("WrongPassword");
//           }
//         });
//       }
//     })
//   });
//
// })
