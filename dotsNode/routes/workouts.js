// REQUIRE APP AND GENERAL FUNCTIONS
var app = require('../server');
var ObjectId = require('mongodb').ObjectID;

// Require checkUser for authentication check
const checkUser = include('routes/functions/checkUser');

var User = require('../schemas/userSchema');
var WorkoutSheet = require('../schemas/workoutSheetSchema');
var WorkoutRecord = require('../schemas/workoutRecordSchema');


app.get("/getSheetData/:sheetId", function(req, res){
  var sheetId = req.params.sheetId;
  var query = {};
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
  var sheetId = req.params.sheetId;

  WorkoutSheet.find({ _id: sheetId})
    .select("Title, Structure")
    .exec(function(err, data){
      if(err) throw err;
      res.send(data);
    })
})

app.post("/createSheet", function(req, res){
  var data = req.body.data;
  data.Structure = [];
  data.WorkoutRecords = [];

  var sheet = new WorkoutSheet(data);

  sheet.save(function(err){
    if(err) throw err;
    else res.send(sheet);
  })
})

app.post("/deleteSheet", function(req, res){
  var sheetId = req.body.sheetId;

  WorkoutSheet.findOne({ _id: ObjectId(sheetId)}).remove(function(err){
    if(err) throw err;
    WorkoutRecord.find({ SheetId: ObjectId(sheetId)}).remove(function(err){
      if(err) throw err;
      else res.send({ message: "success"});
    })

  })
})

app.post("/updateSheetConfiguration", function(req, res){
  var sheet = req.body.data;
  var deletedExerciseIds = sheet.DeletedExercisesId;

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

      for(var i = 0; i < records.length; i++){
        for(var j = 0; j < deletedExerciseIds.length; j++){
            var index = records[i].Columns.indexOf(deletedExerciseIds[j]);
            records[i].Values.splice(index, 1);
            records[i].Columns.splice(index, 1);
            records[i].save();
        }
      }

    })

  }

})

app.post("/addWorkoutRecord", function(req, res){
  var record = req.body.data;
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
  var record = req.body.data;

  console.log(record);

  // Remove existing record with the same date

  WorkoutRecord.remove({
    Date: record.Date,
    _id: { $ne: ObjectId(record.RecordId) }
  }, function(err, removedDocs){
    if(err) throw err;

    WorkoutRecord.update({ _id: ObjectId(record.RecordId) }, {
      $set: {
        Date: record.Date,
        Values: record.Values,
        Columns: record.Columns
      }
    }, function(err, doc){
      if(err) throw err;
      console.log(0);

      res.send({ deletedDocs: removedDocs.deletedCount });
    })

  })
})


app.post("/deleteWorkoutRecord", function(req, res){
  var recordId = req.body.recordId;

  console.log(recordId);

  WorkoutRecord.findOneAndDelete({_id: ObjectId(recordId)}, function(err){
    if(err) throw err;
    else res.send({ message: "success" });
  })
})
