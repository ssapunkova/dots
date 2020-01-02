

//Require Mongoose
var mongoose = require('mongoose');
var ObjectId = require('mongodb').ObjectID;


var StructureSchema = mongoose.Schema({ Title: String, Goal: String, Type: String});

var WorkoutSheetSchema = mongoose.Schema({
    UserId: { type: mongoose.Schema.Types.ObjectId, ref: 'User'},
	  Title: String,
	  Structure: [StructureSchema]
},
{ collection: "workoutSheets"}
);

WorkoutSheetSchema.set('toObject', { virtuals: true })
WorkoutSheetSchema.set('toJSON', { virtuals: true })

WorkoutSheetSchema.virtual('WorkoutRecords', {
  ref: 'WorkoutRecord', // The model to use
  localField: '_id', // Find people where `localField`
  foreignField: 'SheetId', // is equal to `foreignField`
  justOne: false,
  options: { sort: { name: -1 } }
});

WorkoutSheetSchema.virtual('WorkoutRecordsNumber', {
  ref: 'WorkoutRecord', // The model to use
  localField: '_id', // Find people where `localField`
  foreignField: 'SheetId', // is equal to `foreignField`
  justOne: false,
  count: true,
  options: { sort: { name: -1 } }
});

var WorkoutSheet = mongoose.model('WorkoutSheet', WorkoutSheetSchema);

module.exports = WorkoutSheet;
