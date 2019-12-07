// REQUIRE APP AND GENERAL FUNCTIONS
var app = require('../server');
var ObjectId = require('mongodb').ObjectID;

// Mongoose
var mongoose = require('mongoose');
var dbConnectionSettings = require('../dbConnectionSettings');
const baseUrl = dbConnectionSettings.baseUrl; // require base url of the database
const connectParams = dbConnectionSettings.connectParams; // require base url of the database

var User = require('../schemas/userSchema');
//
// app.get("/register", function(req, res){
//     res.render("register");
// })
//
// app.post("/register", function(req, res){
//   var userData = req.body;
//   console.log(userData);
//
//   mongoose.connect(baseUrl, connectParams, function (err) {
//     if(err) throw err;
//
//     var newUser = new User(userData);
//     newUser.Status = "user";
//
//     User.findOne( { $or: [{ Username: newUser.Username}, { Email: newUser.Email }] })
//     .exec(function(err, existingUser){
//       if(err) throw err;
//       console.log(existingUser);
//
//       if(existingUser == null){
//         newUser.save(function(err){
//          if(err) throw err;
//          else{
//            res.send("RegisteredSuccessfully");
//          }
//        });
//       }
//       else{
//         var error = "";
//         if(existingUser.Username == newUser.Username){
//           error = "SameUsername";
//         }
//         else if(existingUser.Email == newUser.Email){
//           error = "SameEmail";
//         }
//
//         res.send(error);
//       }
//
//
//     })
//   });
//
// })
