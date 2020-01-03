// REQUIRE APP AND GENERAL FUNCTIONS
const app = require('../server');
const ObjectId = require('mongodb').ObjectID;

// Require checkUser for authentication check
const checkUser = include('routes/functions/checkUser');

const User = require('../schemas/userSchema');
const WorkoutSheet = require('../schemas/workoutSheetSchema');
const WorkoutRecord = require('../schemas/workoutRecordSchema');


app.get("/getSheetData/:sheetId", function(req, res){
  let sheetId = req.params.sheetId;
  let query = {};
  if(sheetId != "all") {
    query = { _id: ObjectId(sheetId) };
  }

  WorkoutSheet.find(query)
    .populate("WorkoutRecords")
    .exec(function(err, data){
      if(err) throw err;
      res.send(data);
    })

})

app.get("/getSheetExercises/:sheetId", function(req, res){
  let sheetId = req.params.sheetId;

  WorkoutSheet.find({ _id: sheetId})
    .select("Title, Structure")
    .exec(function(err, data){
      if(err) throw err;
      res.send(data);
    })
})

app.post("/createSheet", function(req, res){
  let data = req.body.data;
  data.Structure = [];
  data.WorkoutRecords = [];

  let sheet = new WorkoutSheet(data);

  sheet.save(function(err){
    if(err) throw err;
    else res.send(sheet);
  })
})

app.post("/deleteSheet", function(req, res){
  let sheetId = req.body.sheetId;

  WorkoutSheet.findOne({ _id: ObjectId(sheetId)}).remove(function(err){
    if(err) throw err;
    WorkoutRecord.find({ SheetId: ObjectId(sheetId)}).remove(function(err){
      if(err) throw err;
      else res.send({ message: "success"});
    })

  })
})

app.post("/updateSheetConfiguration", function(req, res){
  let sheet = req.body.data;
  let deletedExerciseIds = sheet.DeletedExercisesId;

  console.log("Delete", deletedExerciseIds);
  console.log("Orig", sheet);

  sheetObj = new WorkoutSheet(sheet);

  console.log("New", sheetObj);

  WorkoutSheet.update({ _id: sheet._id }, sheetObj)
  .exec(function(err, docs){
    if(err) throw err;
    else res.send({ message: "success" })
  })

  if(deletedExerciseIds.length > 0){

    WorkoutRecord.find({ Columns: { $in: deletedExerciseIds }})
    .exec(function(err, records){
      if(err) throw err;
      console.log(records);

      for(let i = 0; i < records.length; i++){
        for(let j = 0; j < deletedExerciseIds.length; j++){
            let index = records[i].Columns.indexOf(deletedExerciseIds[j]);
            records[i].Values.splice(index, 1);
            records[i].Columns.splice(index, 1);
            records[i].save();
        }
      }

    })

  }

})

app.post("/addWorkoutRecord", function(req, res){
  let record = req.body.data;
  console.log(record, db);

  WorkoutRecord.update({ Date: record.Date }, {
    $set: {
      SheetId: record.SheetId,
      Values: record.Values,
      Columns: record.Columns,
      Time: record.Time
    }
  }, { upsert: true }, function(err, docs){
    if(err) throw err;
    console.log(docs);
    if(docs.upserted != undefined){
      if(docs.upserted[0]._id != undefined){
        record._id = docs.upserted[0]._id;
      }
    }
    res.send({ record: record, docs: docs });
  })
})


app.post("/editWorkoutRecord", function(req, res){
  let record = req.body.data;

  console.log(record);

  // Remove existing record with the same date

  WorkoutRecord.remove({
    Date: record.Date,
    _id: { $ne: ObjectId(record.RecordId) }
  })
  .then((err, removedDocs) => {
    if(err) throw err;

    WorkoutRecord.update({ _id: ObjectId(record.RecordId) }, {
      $set: {
        Date: record.Date,
        Values: record.Values,
        Columns: record.Columns
      }
    })
    .then((err, doc) => {
      if(err) throw err;
      console.log(0);

      res.send({ deletedDocs: removedDocs.deletedCount });
    })
  })
})


app.post("/deleteWorkoutRecord", function(req, res){
  let recordId = req.body.recordId;

  console.log(recordId);

  WorkoutRecord.findOneAndDelete({_id: ObjectId(recordId)})
  .then((err) => {
    if(err) throw err;
    else res.send({ message: "success" });
  })
})
