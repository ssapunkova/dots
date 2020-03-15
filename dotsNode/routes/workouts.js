// SET ROUTER AND GENERAL FUNCTIONS
let express = require('express');
let router = express.Router();
const ObjectId = require('mongodb').ObjectID;

const User = require('../schemas/userSchema');
const WorkoutSheet = require('../schemas/workoutSheetSchema');
const WorkoutRecord = require('../schemas/workoutRecordSchema');

router.use(function timeLog(req, res, next) {
  console.log('Time: ', Date.now());
  next();
});



router.get("/getSheetData/:sheetId", async (req, res) => {
  let sheetId = req.params.sheetId;
  let query = {};
  if(sheetId != "all")  query = { _id: ObjectId(sheetId) };

  let sheetData = await WorkoutSheet.find(query).populate("WorkoutRecords").exec();
  if(sheetData.err) throw sheetData.err;
  res.send(sheetData);
})

router.get("/getSheetExercises/:sheetId", async (req, res) => {
  let sheetId = req.params.sheetId;

  let exercises = await WorkoutSheet.find({ _id: sheetId}).select("Title, Params").exec();
  if(exercises.err) throw exercises.err;
  res.send(exercises);
})

router.get("/getExerciseTimes/:sheetId", async (req, res) => {
  let sheetId = req.params.sheetId;

  let exerciseTimes = await WorkoutRecord.find(
    {
      SheetId: sheetId,
      Time: { $ne: null }
    }
  ).select("Time").exec();
  if(exerciseTimes.err) throw exerciseTimes.err;
  res.send(exerciseTimes);
})

router.post("/createSheet", async (req, res) => {
  let data = req.body.data;
  let sheet = new WorkoutSheet(data);

  let saveSheet = await sheet.save();
  if(saveSheet.err) throw saveSheet.err;
  else res.send(sheet);
})

router.post("/deleteSheet", async (req, res) => {
  let sheetId = req.body.sheetId;

  console.log(sheetId)

  let deleteSheet = await WorkoutSheet.deleteOne({ _id: ObjectId(sheetId)})
  let deleteSheetRecords = await WorkoutRecord.deleteMany({ SheetId: ObjectId(sheetId)});
  if(deleteSheet.err) throw deleteSheet.err;
  else if(deleteSheetRecords.err) throw deleteSheetRecords.err;
  else res.send();

})

router.post("/updateSheetConfiguration", async (req, res) => {
  let sheet = req.body.data;
  let deletedExerciseIds = sheet.DeletedExercisesId;

  let updateSheet = await WorkoutSheet.updateOne({ _id: sheet._id }, sheet).exec();
  if(updateSheet.err) throw updateSheet.err;

  if(deletedExerciseIds.length > 0){

    let recordsOfDeletedExercises = await WorkoutRecord.find({ Params: { $in: deletedExerciseIds }}).exec();
    if(recordsOfDeletedExercises.err) throw recordsOfDeletedExercises.err;
    else{
      for(let i = 0; i < recordsOfDeletedExercises.length; i++){
        for(let j = 0; j < deletedExerciseIds.length; j++){
          let index = recordsOfDeletedExercises[i].Params.indexOf(deletedExerciseIds[j]);
          recordsOfDeletedExercises[i].Values.splice(index, 1);
          recordsOfDeletedExercises[i].Params.splice(index, 1);
          recordsOfDeletedExercises[i].save();
        }
      }
    }
  }

  res.send();
})

router.post("/addWorkoutRecord", async (req, res) => {
  let record = req.body.data;

  let upsertRecord = await WorkoutRecord.updateOne({ Date: record.Date }, {
    $set: {
      SheetId: record.SheetId,
      Values: record.Values,
      Params: record.Params,
      Time: record.Time
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


router.post("/editWorkoutRecord", async (req, res) => {
  let record = req.body.data;

  // delete existing record with the same date

  let deletedRecord = await WorkoutRecord.deleteOne({
    Date: record.Date,
    _id: { $ne: ObjectId(record.RecordId) }
  })

  let updateRecord = await WorkoutRecord.updateOne({ _id: ObjectId(record.RecordId) }, {
    $set: {
      Date: record.Date,
      Values: record.Values,
      Params: record.Params
    }
  })
  if(deletedRecord.err) throw deletedRecord.err;
  else if(updateRecord.err) throw updateRecord.err;
  else res.send({ deletedDocs: deletedRecord.deletedCount });

})


router.post("/deleteWorkoutRecord", async (req, res) => {
  let recordId = req.body.recordId;

  console.log(recordId)

  let deleteRecord = await WorkoutRecord.findOneAndDelete({_id: ObjectId(recordId)})
  if(deleteRecord != null && deleteRecord.err) throw deleteRecord.err;
  else res.send();
})

module.exports = router;