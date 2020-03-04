//Require Mongoose
const mongoose = require('mongoose');

const WorkoutRecordSchema = mongoose.Schema({
    SheetId: { type: mongoose.Schema.Types.ObjectId, ref: 'WorkoutSheet'},
    Date: String,
    Params: Array,
    Values: Array,
    Time: Number
},
{ collection: "workoutRecords" }
);


const WorkoutRecord = mongoose.model('WorkoutRecord', WorkoutRecordSchema);

module.exports = WorkoutRecord;
