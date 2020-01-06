
//Require Mongoose
const mongoose = require('mongoose');
const ObjectId = require('mongodb').ObjectID;

const NutritionSchema = mongoose.Schema({
    UserId: { type: mongoose.Schema.Types.ObjectId, ref: 'User'},
	  Structure: Array,
	  Goals: Array
},
{ collection: "nutrition"}
);

const Nutrition = mongoose.model('Nutrition', NutritionSchema);

module.exports = Nutrition;
