// REQUIRE APP AND GENERAL FUNCTIONS
const app = require('../server');
const ObjectId = require('mongodb').ObjectID;

// Require checkUser for authentication check
const checkUser = include('routes/functions/checkUser');

const User = require('../schemas/userSchema');
const BodyMassConstants = require('../schemas/bodyMassConstantsSchema');


app.get("/getBodyMassConstants/:gender", async (req, res) => {
  console.log("a");

  // let nutritionData = await Nutrition.findOne({ UserId: ObjectId("5d98ade96dfda51dc84991d9") });  // replace with userid later
  // let nutritionRecords = await NutritionRecord.find({ UserId: ObjectId("5d98ade96dfda51dc84991d9") }); // replace with userid later
  // if(nutritionData != null) {
  //   if(nutritionData.err) throw nutritionData.err;
  // }
  // else{
  //   nutritionData = new Nutrition({ UserId: ObjectId("5d98ade96dfda51dc84991d9") })
  //   nutritionData.save();
  // }
  // if(nutritionRecords.err) throw nutritionRecords.err;
  // res.send({ general: nutritionData, records: nutritionRecords});
  res.send({ data: [5] });
})
