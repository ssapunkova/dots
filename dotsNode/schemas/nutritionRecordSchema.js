//Require Mongoose
const mongoose = require('mongoose');
const ObjectId = require('mongodb').ObjectID;


const NutritionRecordSchema = mongoose.Schema({
    SheetId: { type: mongoose.Schema.Types.ObjectId, ref: 'NutritionSheet'},
    Date: String,
    Columns: Array,
    Values: Array,
    Time: Number
},
{ collection: "nutritionRecords" }
);


const NutritionRecord = mongoose.model('NutritionRecord', NutritionRecordSchema);

module.exports = NutritionRecord;
