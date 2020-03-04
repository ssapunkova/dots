
//Require Mongoose
const mongoose = require('mongoose');

const NutritionSchema = mongoose.Schema({
    UserId: { type: mongoose.Schema.Types.ObjectId, ref: 'User'},
	  Params: Array,
	  Goals: Array
},
{ collection: "nutrition"}
);

const Nutrition = mongoose.model('Nutrition', NutritionSchema);

module.exports = Nutrition;
