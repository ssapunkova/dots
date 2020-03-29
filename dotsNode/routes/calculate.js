// SET ROUTER AND GENERAL FUNCTIONS
let express = require('express');
let router = express.Router();
const ObjectId = require('mongodb').ObjectID;

const User = require('../schemas/userSchema');
const BodyMassConstants = require('../schemas/bodyMassConstantsSchema');
const UserParams = require('../schemas/userParamsSchema');

router.get("/getBodyMassConstants/:gender", async (req, res) => {

  let gender = req.params.gender;
  let constants = await BodyMassConstants.find({ Gender: gender});

  res.send(constants);
})

router.get("/getUserParams/:userId", async (req, res) => {

  let userId = req.params.userId;

  console.log("Userid", userId)

  let userParams = await UserParams.findOne({ UserId: ObjectId(userId)});

  res.send(userParams);
})

router.post("/updateUserParams", async (req, res) => {

  let userId = req.body.userId;
  let data = req.body.data;

  console.log("Params, userId ", userId)
  console.log(data);

  let userParams = await UserParams.findOneAndUpdate(
    { UserId: ObjectId(userId)},
    { 
      Params: data.Params,
      Values: data.Values
    },
    { upsert: true }
  );


  res.send();
})

module.exports = router;