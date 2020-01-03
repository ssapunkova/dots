//Require Mongoose
const mongoose = require('mongoose');

// Require bcrypt for hashing passwords
const bcrypt = require('bcryptjs');
const saltRounds = 10;

//Define a schema
const UserSchema = mongoose.Schema({
    Username: String,
    Password: String,
    Email: String,
    Status: String
},
{ collection: "users" }
);

// Hash password before user is saved to database
UserSchema.pre('save', function (next) {
  let user = this;
  bcrypt.hash(user.Password, 10, function (err, hash){
    if (err) {
      return next(err);
    }
    user.Password = hash;
    next();
  })
});

const User = mongoose.model('User', UserSchema);

module.exports = User;
