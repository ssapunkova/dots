// SET ROUTER AND GENERAL FUNCTIONS
let express = require('express');
let router = express.Router();
const ObjectId = require('mongodb').ObjectID;

const User = require('../schemas/userSchema');

router.use(function timeLog(req, res, next) {
    console.log('Time: ', Date.now());
    next();
  });
  

//
// app.get("/register", function(req, res){
//     res.render("register");
// })
//
// app.post("/register", function(req, res){
//   let userData = req.body;
//   console.log(userData);
//
//   mongoose.connect(baseUrl, connectParams, function (err) {
//     if(err) throw err;
//
//     let newUser = new User(userData);
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
//         let error = "";
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


module.exports = router;