// SET ROUTER AND GENERAL FUNCTIONS
let express = require('express');
let router = express.Router();
const ObjectId = require('mongodb').ObjectID;

const User = require('../schemas/userSchema');
const Vitals = require('../schemas/vitalsSchema');
const VitalsRecord = require('../schemas/vitalsRecordSchema');

router.get("/getVitalsData/:userId", async (req, res) => {
  let userId = req.params.userId;

  let vitalsData = await Vitals.findOne({ UserId: ObjectId(userId) });  // replace with userid later
  let vitalsRecords = await VitalsRecord.find({ UserId: ObjectId(userId) }); // replace with userid later
  if(vitalsData != null) {
    if(vitalsData.err) throw vitalsData.err;
  }
  else{
    vitalsData = new Vitals({ UserId: ObjectId(userId) })
    vitalsData.save();
  }
  if(vitalsRecords.err) throw vitalsRecords.err;
  res.send({ Goals: vitalsData.Goals, Params: vitalsData.Params, Records: vitalsRecords});
})

router.post("/updateVitalsParams", async (req, res) => {
  let data = req.body.data;
  let userId = req.body.userId;
  let params = data.params;
  let customGoals = data.customGoals;
  let deletedParams = data.deletedParams;

  let vitalsObj = {
    Goals: customGoals,
    Params: params
  }

  let updateObj = await Vitals.updateOne({ UserId: ObjectId(userId) }, vitalsObj, { upsert: true });
  if(updateObj.err) throw updateObj.err;

  if(deletedParams.length > 0){

    let recordsOfDeletedParams = await VitalsRecord.find(
      {
        UserId: ObjectId(userId),
        Params: { $in: deletedParams }
      }
    );
    if(recordsOfDeletedParams.err) throw recordsOfDeletedParams.err;
    else{
      for(let i = 0; i < recordsOfDeletedParams.length; i++){
        
        // If the deleting param is not the last
        if(recordsOfDeletedParams[i].Params.length > 1){
          for(let j = 0; j < deletedParams.length; j++){

            let index = recordsOfDeletedParams[i].Params.indexOf(deletedParams[j]);
            recordsOfDeletedParams[i].Values.splice(index, 1);
            recordsOfDeletedParams[i].Params.splice(index, 1);
            recordsOfDeletedParams[i].save();
            
          }
        }
        else{
          // If all params are deleted, just delete the record
          recordsOfDeletedParams[i].remove();
        }
      }
    }
  }

  res.send();
})

router.post("/addVitalsRecord", async (req, res) => {
  let record = req.body.data;

  console.log("adding record", record);

  let upsertRecord = await VitalsRecord.updateOne(
    {
      UserId: ObjectId(record.UserId),
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


router.post("/editVitalsRecord", async (req, res) => {
  let record = req.body.data;

  // delete existing record with the same date

  let deletedRecords = await VitalsRecord.deleteOne({
    Date: record.Date,
    _id: { $ne: ObjectId(record.RecordId) }
  })

  let updateRecord = await VitalsRecord.updateOne({ _id: ObjectId(record.RecordId) }, {
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


router.post("/deleteVitalsRecord", async (req, res) => {
  let recordId = req.body.recordId;

  let deleteRecord = await VitalsRecord.findOneAndDelete({_id: ObjectId(recordId)})
  if(deleteRecord != null && deleteRecord.err) throw deleteRecord.err;
  else res.send();
})

module.exports = router;