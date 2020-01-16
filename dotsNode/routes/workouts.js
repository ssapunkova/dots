// REQUIRE APP AND GENERAL FUNCTIONS
const app = require('../server');
const ObjectId = require('mongodb').ObjectID;

// Require checkUser for authentication check
const checkUser = include('routes/functions/checkUser');

const User = require('../schemas/userSchema');
const WorkoutSheet = require('../schemas/workoutSheetSchema');
const WorkoutRecord = require('../schemas/workoutRecordSchema');


app.get("/getSheetData/:sheetId", async (req, res) => {
  let sheetId = req.params.sheetId;
  let query = {};
  if(sheetId != "all")  query = { _id: ObjectId(sheetId) };

  let sheetData = await WorkoutSheet.find(query).populate("WorkoutRecords").exec();
  if(sheetData.err) throw sheetData.err;
  res.send(sheetData);
})

app.get("/getSheetExercises/:sheetId", async (req, res) => {
  let sheetId = req.params.sheetId;

  let exercises = await WorkoutSheet.find({ _id: sheetId}).select("Title, Params").exec();
  if(exercises.err) throw exercises.err;
  res.send(exercises);
})

app.get("/getExerciseTimes/:sheetId", async (req, res) => {
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

app.post("/createSheet", async (req, res) => {
  let data = req.body.data;
  let sheet = new WorkoutSheet(data);

  let saveSheet = await sheet.save();
  if(saveSheet.err) throw saveSheet.err;
  else res.send(sheet);
})

app.post("/deleteSheet", async (req, res) => {
  let sheetId = req.body.sheetId;

  let removeSheet = await WorkoutSheet.findOne({ _id: ObjectId(sheetId)}).remove();
  let removeSheetRecords = WorkoutRecord.find({ SheetId: ObjectId(sheetId)}).remove();
  if(removeSheet.err) throw removeSheet.err;
  else if(removeSheetRecords.err) throw removeSheetRecords.err;
  else res.send();

})

app.post("/updateSheetConfiguration", async (req, res) => {
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

app.post("/addWorkoutRecord", async (req, res) => {
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


app.post("/editWorkoutRecord", async (req, res) => {
  let record = req.body.data;

  // Remove existing record with the same date

  let removedRecords = await WorkoutRecord.remove({
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
  if(removedRecords.err) throw removedRecords.err;
  else if(updateRecord.err) throw updateRecord.err;
  else res.send({ deletedDocs: removedRecords.deletedCount });

})


app.post("/deleteWorkoutRecord", async (req, res) => {
  let recordId = req.body.recordId;

  let deleteRecord = await WorkoutRecord.findOneAndDelete({_id: ObjectId(recordId)})
  if(deleteRecord.err) throw deleteRecord.err;
  else res.send();
})
