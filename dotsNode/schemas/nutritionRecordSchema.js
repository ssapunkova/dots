//Require Mongoose
const mongoose = require('mongoose');
const ObjectId = require('mongodb').ObjectID;


const NutritionRecordSchema = mongoose.Schema({
    UserId: { type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    Date: String,
    Params: Array,
    Values: Array
},
{ collection: "nutritionRecords" }
);


const NutritionRecord = mongoose.model('NutritionRecord', NutritionRecordSchema);

module.exports = NutritionRecord;
