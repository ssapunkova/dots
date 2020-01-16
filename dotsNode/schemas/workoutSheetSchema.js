

//Require Mongoose
const mongoose = require('mongoose');
const ObjectId = require('mongodb').ObjectID;


const ParameterSchema = mongoose.Schema({ Title: String, Goal: String, Type: String});

const WorkoutSheetSchema = mongoose.Schema({
    UserId: { type: mongoose.Schema.Types.ObjectId, ref: 'User'},
	  Title: String,
	  Params: [ParameterSchema]
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

const WorkoutSheet = mongoose.model('WorkoutSheet', WorkoutSheetSchema);

module.exports = WorkoutSheet;
