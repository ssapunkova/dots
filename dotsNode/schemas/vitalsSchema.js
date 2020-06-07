
//Require Mongoose
const mongoose = require('mongoose');

const VitalsSchema = mongoose.Schema({
    UserId: { type: mongoose.Schema.Types.ObjectId, ref: 'User'},
	  Params: Array,
	  Goals: Array
},
{ collection: "vitals"}
);

const Vitals = mongoose.model('Vitals', VitalsSchema);

module.exports = Vitals;
