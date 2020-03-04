// REQUIRE APP AND GENERAL FUNCTIONS
const app = require('../server');
const ObjectId = require('mongodb').ObjectID;

// Require checkUser for authentication check
const checkUser = include('routes/functions/checkUser');

const User = require('../schemas/userSchema');
const BodyMassConstants = require('../schemas/bodyMassConstantsSchema');
const UserParams = require('../schemas/userParamsSchema');


app.get("/getBodyMassConstants/:gender", async (req, res) => {

  let gender = req.params.gender;
  let constants = await BodyMassConstants.find({ Gender: gender});

  res.send(constants);
})

app.get("/getUserParams", async (req, res) => {

  let userParams = await UserParams.findOne({ UserId: ObjectId("5d98ade96dfda51dc84991d9")});

  res.send(userParams);
})