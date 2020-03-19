// SET ROUTER AND GENERAL FUNCTIONS
let express = require('express');
let router = express.Router();
const ObjectId = require('mongodb').ObjectID;
let nodemailer = require('nodemailer');

var mail = require('./functions/mail');

const User = require('../schemas/userSchema');

router.post('/sendRegistrationEmail', async (req, res) => {
  let email = req.body.email;
  let name = req.body.name;
  let emailContent = req.body.emailContent;
  console.log("sending email to " + email + "; " + name);
  console.log(emailContent);

  let transporter = mail.getMailTransporter();

  let mailOptions = {
      from: mail.sender.address,
      to: email,
      subject: emailContent.subject,
      html: emailContent.html
  };

  transporter.sendMail(mailOptions, function(err, info){
      if (err) throw err;
      else res.send();
  });
})


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