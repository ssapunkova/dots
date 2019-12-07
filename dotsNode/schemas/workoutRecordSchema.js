//Require Mongoose
var mongoose = require('mongoose');
var ObjectId = require('mongodb').ObjectID;


var WorkoutRecordSchema = mongoose.Schema({
    SheetId: { type: mongoose.Schema.Types.ObjectId, ref: 'WorkoutSheet'},
    Date: String,
    Columns: Array,
    Values: Array
},
{ collection: "workoutRecords" }
);


var WorkoutRecord = mongoose.model('WorkoutRecord', WorkoutRecordSchema);

module.exports = WorkoutRecord;
