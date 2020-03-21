// SET ROUTER AND GENERAL FUNCTIONS
let express = require('express');
let router = express.Router();
const ObjectId = require('mongodb').ObjectID;

// Require bcrypt for hashing passwords
const bcrypt = require('bcryptjs');
const saltRounds = 10;

const User = require('../schemas/userSchema');

router.get('/', function(req, res) {
    res.render("login")
})

router.get('/logout', function(req, res){
    console.log("a");
    res.clearCookie("DotsUserId");
    res.clearCookie("DotsUsername");
    res.redirect('/login');
})

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
//   let userData = req.body;
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
//             let hour = 3600000;
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

module.exports = router;