//Require Mongoose
const mongoose = require('mongoose');
const ObjectId = require('mongodb').ObjectID;


const WorkoutRecordSchema = mongoose.Schema({
    SheetId: { type: mongoose.Schema.Types.ObjectId, ref: 'WorkoutSheet'},
    Date: String,
    Columns: Array,
    Values: Array,
    Time: Array
},
{ collection: "workoutRecords" }
);


const WorkoutRecord = mongoose.model('WorkoutRecord', WorkoutRecordSchema);

module.exports = WorkoutRecord;
