//Require Mongoose
const mongoose = require('mongoose');

const VitalsRecordSchema = mongoose.Schema({
    UserId: { type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    Date: String,
    Params: Array,
    Values: Array
},
{ collection: "vitalsRecords" }
);


const VitalsRecord = mongoose.model('VitalsRecord', VitalsRecordSchema);

module.exports = VitalsRecord;
