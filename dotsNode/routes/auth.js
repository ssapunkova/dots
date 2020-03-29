// SET ROUTER AND GENERAL FUNCTIONS
let express = require('express');
let router = express.Router();
const ObjectId = require('mongodb').ObjectID;
let nodemailer = require('nodemailer');

// Require bcrypt for hashing passwords
const bcrypt = require('bcryptjs');
const saltRounds = 10;

var mail = require('./functions/mail');

const User = require('../schemas/userSchema');
const VerificationToken = require('../schemas/verificationTokenSchema');

router.post('/checkEmail', async (req, res) => {
  let email = req.body.email;

  let findEmail = await User.findOne({ Email: email });
  let result = 0;

  if(findEmail != null){
    result = 1;
  }
  
  res.send({ matchingEmails: result });
})

router.post('/checkToken', async (req, res) => {
  let tokenId = req.body.tokenId;
  let ObjId;

  // Try converting tokenId to ObjectId, if it fails it means tokenId is not a valid id
  try{
    ObjId = ObjectId(tokenId);

    let findToken = await VerificationToken.findOne({ _id: ObjId });
    let result = false;

    if(findToken != null){
      result = true;
    }
  }
  catch{
    result = false;
  }

  res.send({ tokenExists: result });
})

router.post('/sendRegistrationEmail', async (req, res) => {
  let email = req.body.email;
  let emailContent = req.body.emailContent;
  console.log("sending email to " + email + "; ");
  console.log(emailContent);

  let newVerificationToken = new VerificationToken({
    Email: email
  });
  newVerificationToken.save();
  let tokenId = newVerificationToken._id;

  console.log("Verification token id: " + tokenId)

  let transporter = mail.getMailTransporter();

  let mailOptions = {
    from: mail.sender.address,
    to: email,
    subject: emailContent.subject,
    html: "<a href='" + emailContent.appUrl + "/register/" + tokenId + "'>" + emailContent.linkText + "</a>"
  };

  transporter.sendMail(mailOptions, function(err, info){
    if (err) throw err;
    else res.send();
  });
})

router.post('/finishRegistration', async(req, res) => {
  let tokenId = req.body.data.tokenId;
  let username = req.body.data.username;
  let password = req.body.data.password;

  let token = await VerificationToken.findOne({ _id: ObjectId(tokenId)});
  let email = token.Email;

  console.log(email, password, username);
  console.log("Deleted token: ", tokenId);

  let newUser = new User({
    Username: username,
    Email: email,
    Password: password,
    Status: "user"
  })

  newUser.save();
  
  token.remove();

  res.send()
})

router.get("/logout", async (req, res) => {
  console.log("a");
  res.clearCookie("DotsUserId");
  res.clearCookie("DotsUsername");
  res.redirect('/login');
})


router.post("/login", async (req, res) => {
  let userData = req.body.userData;
  console.log(userData);

  let user = await User.findOne({ Email: userData.email });
  
  console.log(user);

  bcrypt.compare(userData.password, user.Password, function (err, result) {
    if (result === true) {
      res.send({ userData: { 
        _id: user._id,
        Username: user.Username, 
        Status: user.Status, 
        Email: user.Email 
      } });
    }
    else{
      res.send({ error: "WrongPasswordError"});
    }
  });

})

router.post("/handleFbUser", async(req, res) => {
  let userData = req.body.userData;
  console.log(userData);
  console.log("handle");

  let user = await User.findOne({ FbToken: userData.authToken });


  if(user == null){

    let user = new User({
      Username: userData.name,
      Email: userData.email,
      FbToken: userData.authToken,
      Status: "user"
    })

    user.save();
    console.log("new user ", user)
  }
  
})

module.exports = router;