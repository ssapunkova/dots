
//Require Mongoose
const mongoose = require('mongoose');

const UserParamsSchema = mongoose.Schema({
    UserId: { type: mongoose.Schema.Types.ObjectId, ref: 'User'},
	Params: Array,
	Values: Array
},
{ collection: "userParams"}
);

const UserParams = mongoose.model('UserParams', UserParamsSchema);

module.exports = UserParams;
