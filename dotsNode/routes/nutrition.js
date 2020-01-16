// REQUIRE APP AND GENERAL FUNCTIONS
const app = require('../server');
const ObjectId = require('mongodb').ObjectID;

// Require checkUser for authentication check
const checkUser = include('routes/functions/checkUser');

const User = require('../schemas/userSchema');
const Nutrition = require('../schemas/nutritionSchema');
const NutritionRecord = require('../schemas/nutritionRecordSchema');


app.get("/getNutritionData", async (req, res) => {

  let nutritionData = await Nutrition.findOne({ UserId: ObjectId("5d98ade96dfda51dc84991d9") }).exec();  // replace with userid later
  let nutritionRecords = await NutritionRecord.find({ UserId: ObjectId("5d98ade96dfda51dc84991d9") }).exec(); // replace with userid later
  if(nutritionData.err) throw nutritionData.err;
  if(nutritionRecords.err) throw nutritionRecords.err;
  res.send({ nutritionData: nutritionData, nutritionRecords: nutritionRecords});
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

  console.log(nutritionObj)

  let updateObj = await Nutrition.updateOne({ UserId: ObjectId("5d98ade96dfda51dc84991d9") }, nutritionObj, { upsert: true }).exec();
  if(updateObj.err) throw updateObj.err;

  if(deletedParams.length > 0){

    let recordsOfDeletedParams = await NutritionRecord.find({ Params: { $in: deletedParams }}).exec();
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

  let upsertRecord = await NutritionRecord.update({ Date: record.Date }, {
    $set: {
      Values: record.Values,
      Params: record.Params
    }
  }, { upsert: true });

  if(upsertRecord.err) throw upsertRecord.err;
  else{
    if(upsertRecord.upserted != undefined){
      if(upsertRecord.upserted[0]._id != undefined){
        record._id = upsertRecord.upserted[0]._id;
      }
    }
    res.send({ record: record, docs: upsertRecord });
  }
})


app.post("/editNutritionRecord", async (req, res) => {
  let record = req.body.data;

  // Remove existing record with the same date

  let removedRecords = await NutritionRecord.remove({
    Date: record.Date,
    _id: { $ne: ObjectId(record.RecordId) }
  })

  let updateRecord = await NutritionRecord.update({ _id: ObjectId(record.RecordId) }, {
    $set: {
      Date: record.Date,
      Values: record.Values,
      Params: record.Params
    }
  })
  if(removedRecords.err) throw removedRecords.err;
  else if(updateRecord.err) throw updateRecord.err;
  else res.send({ deletedDocs: removedRecords.deletedCount });

})


app.post("/deleteNutritionRecord", async (req, res) => {
  let recordId = req.body.recordId;

  let deleteRecord = await NutritionRecord.findOneAndDelete({_id: ObjectId(recordId)})
  if(deleteRecord.err) throw deleteRecord.err;
  else res.send();
})
