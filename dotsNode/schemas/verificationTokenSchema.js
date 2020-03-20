//Require Mongoose
const mongoose = require('mongoose');

//Define a schema
const VerificationTokenSchema = mongoose.Schema({
    Created: { type: Date, required: true, default: Date.now, expires: 43200 }
},
{ collection: "verificationTokens" }
);

const VerificationToken = mongoose.model('VerificationToken', VerificationTokenSchema);

module.exports = User;
