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

router.get("/getUserParams", async (req, res) => {

  let userParams = await UserParams.findOne({ UserId: ObjectId("5d98ade96dfda51dc84991d9")});

  res.send(userParams);
})


// router.get("/getUserParams", async (req, res) => {
//   res.send({"ag": 66});
// })

router.post("/updateUserParams", async (req, res) => {

  let params = req.body.data;
  console.log("Params")
  console.log(params);

  let userParams = await UserParams.findOneAndUpdate(
    { UserId: ObjectId("5d98ade96dfda51dc84991d9")},
    { 
      Params: params.Params,
      Values: params.Values
    },
    { upsert: true }
  );


  res.send();
})

module.exports = router;