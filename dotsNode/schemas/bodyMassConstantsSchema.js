//Require Mongoose
var mongoose = require('mongoose');
var ObjectId = require('mongodb').ObjectID;

//Define a schema
var BodyMassConstantsSchema = mongoose.Schema({
    Gender: String,
    Weight: Number,
    Values: Array,
    Hips: Number,
    Constant: Number
},
{ collection: "bodyMassConstantsF" }
);

var BodyMassConstants = mongoose.model('BodyMassConstants', BodyMassConstantsSchema);

module.exports = BodyMassConstants;
