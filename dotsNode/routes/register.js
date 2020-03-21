// SET ROUTER AND GENERAL FUNCTIONS
let express = require('express');
let router = express.Router();
const ObjectId = require('mongodb').ObjectID;
let nodemailer = require('nodemailer');

var mail = require('./functions/mail');

const User = require('../schemas/userSchema');
const VerificationToken = require('../schemas/verificationTokenSchema');

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

module.exports = router;