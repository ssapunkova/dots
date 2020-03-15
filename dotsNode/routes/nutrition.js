// REQUIRE APP AND GENERAL FUNCTIONS
const app = require('../index');
const ObjectId = require('mongodb').ObjectID;

// Require checkUser for authentication check
const checkUser = include('routes/functions/checkUser');

const User = require('../schemas/userSchema');
const Nutrition = require('../schemas/nutritionSchema');
const NutritionRecord = require('../schemas/nutritionRecordSchema');


app.get("/getNutritionData", async (req, res) => {

  let nutritionData = await Nutrition.findOne({ UserId: ObjectId("5d98ade96dfda51dc84991d9") });  // replace with userid later
  let nutritionRecords = await NutritionRecord.find({ UserId: ObjectId("5d98ade96dfda51dc84991d9") }); // replace with userid later
  if(nutritionData != null) {
    if(nutritionData.err) throw nutritionData.err;
  }
  else{
    nutritionData = new Nutrition({ UserId: ObjectId("5d98ade96dfda51dc84991d9") })
    nutritionData.save();
  }
  if(nutritionRecords.err) throw nutritionRecords.err;
  res.send({ general: nutritionData, records: nutritionRecords});
})

app.post("/updateNutritionParams", async (req, res) => {
  let data = req.body.data;
  let params = data.params;
  let customGoals = data.customGoals;
  let deletedParams = data.deletedParams;

  let nutritionObj = {
    Goals: customGoals,
    Params: params
  }

  let updateObj = await Nutrition.updateOne({ UserId: ObjectId("5d98ade96dfda51dc84991d9") }, nutritionObj, { upsert: true });
  if(updateObj.err) throw updateObj.err;

  if(deletedParams.length > 0){

    let recordsOfDeletedParams = await NutritionRecord.find(
      {
        UserId: ObjectId("5d98ade96dfda51dc84991d9"),
        Params: { $in: deletedParams }
      }
    );
    if(recordsOfDeletedParams.err) throw recordsOfDeletedParams.err;
    else{
      for(let i = 0; i < recordsOfDeletedParams.length; i++){
        for(let j = 0; j < deletedParams.length; j++){
          let index = recordsOfDeletedParams[i].Params.indexOf(deletedParams[j]);
          recordsOfDeletedParams[i].Values.splice(index, 1);
          recordsOfDeletedParams[i].Params.splice(index, 1);
          recordsOfDeletedParams[i].save();
        }
      }
    }
  }

  res.send();
})

app.post("/addNutritionRecord", async (req, res) => {
  let record = req.body.data;

  console.log("adding record", record);

  let upsertRecord = await NutritionRecord.updateOne(
    {
      UserId: ObjectId("5d98ade96dfda51dc84991d9"),
      Date: record.Date
    },
    {
      $set: {
        Values: record.Values,
        Params: record.Params
      }
    }, { upsert: true });

  if(upsertRecord.err) throw upsertRecord.err;
  else{
    res.send({ record: record });
  }
})


app.post("/editNutritionRecord", async (req, res) => {
  let record = req.body.data;

  // delete existing record with the same date

  let deletedRecords = await NutritionRecord.deleteOne({
    Date: record.Date,
    _id: { $ne: ObjectId(record.RecordId) }
  })

  let updateRecord = await NutritionRecord.updateOne({ _id: ObjectId(record.RecordId) }, {
    $set: {
      Date: record.Date,
      Values: record.Values,
      Params: record.Params
    }
  })
  if(deletedRecords.err) throw deletedRecords.err;
  else if(updateRecord.err) throw updateRecord.err;
  else res.send({ deletedDocs: deletedRecords.deletedCount });

})


app.post("/deleteNutritionRecord", async (req, res) => {
  let recordId = req.body.recordId;

  let deleteRecord = await NutritionRecord.findOneAndDelete({_id: ObjectId(recordId)})
  if(deleteRecord != null && deleteRecord.err) throw deleteRecord.err;
  else res.send();
})
