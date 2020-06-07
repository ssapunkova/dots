const functions = require('firebase-functions');

// REQUIRE APP AND GENERAL FUNCTIONS
const http = require('http');
const express = require('express');
const app = module.exports = express();
const cookieParser = require('cookie-parser');

const port = process.env.PORT || 8080;
// const appUrl = 'http://localhost:8100';
const appUrl = "https://dotsapp-58afb.firebaseapp.com";

app.use(express.static('public'));
app.use(express.json());
app.set('view engine', 'ejs');
app.use(cookieParser());

// Function for requiring files from root folder
global.base_dir = __dirname;
global.abs_path = function(path) {
  return base_dir + path;
}
global.include = function(file) {
  return require(abs_path('/' + file));
}

const ObjectId = require('mongodb').ObjectID;

const User = require('../schemas/userSchema');
const Vitals = require('../schemas/vitalsSchema');
const VitalsRecord = require('../schemas/vitalsRecordSchema');


app.get("/getVitalsData", async (req, res) => {

  let vitalsData = await Vitals.findOne({ UserId: ObjectId("5d98ade96dfda51dc84991d9") });  // replace with userid later
  let vitalsRecords = await VitalsRecord.find({ UserId: ObjectId("5d98ade96dfda51dc84991d9") }); // replace with userid later
  if(vitalsData !== null) {
    if(vitalsData.err) throw vitalsData.err;
  }
  else{
    vitalsData = new Vitals({ UserId: ObjectId("5d98ade96dfda51dc84991d9") })
    vitalsData.save();
  }
  if(vitalsRecords.err) throw vitalsRecords.err;
  res.send({ general: vitalsData, records: vitalsRecords});
})

app.post("/updateVitalsParams", async (req, res) => {
  let data = req.body.data;
  let params = data.params;
  let customGoals = data.customGoals;
  let deletedParams = data.deletedParams;

  let vitalsObj = {
    Goals: customGoals,
    Params: params
  }

  let updateObj = await Vitals.updateOne({ UserId: ObjectId("5d98ade96dfda51dc84991d9") }, vitalsObj, { upsert: true });
  if(updateObj.err) throw updateObj.err;

  if(deletedParams.length > 0){

    let recordsOfDeletedParams = await VitalsRecord.find(
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

app.post("/addVitalsRecord", async (req, res) => {
  let record = req.body.data;

  console.log("adding record", record);

  let upsertRecord = await VitalsRecord.updateOne(
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


app.post("/editVitalsRecord", async (req, res) => {
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


app.post("/deleteVitalsRecord", async (req, res) => {
  let recordId = req.body.recordId;

  let deleteRecord = await VitalsRecord.findOneAndDelete({_id: ObjectId(recordId)})
  if(deleteRecord !== null && deleteRecord.err) throw deleteRecord.err;
  else res.send();
})

exports.app = functions.https.onRequest(app);

