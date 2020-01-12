// REQUIRE APP AND GENERAL FUNCTIONS
const app = require('../server');
const ObjectId = require('mongodb').ObjectID;

// Require checkUser for authentication check
const checkUser = include('routes/functions/checkUser');

const User = require('../schemas/userSchema');
const Nutrition = require('../schemas/nutritionSchema');
const NutritionRecord = require('../schemas/nutritionRecordSchema');


app.get("/getNutritionData", async (req, res) => {

  let nutritionData = await Nutrition.find({}).exec();  // replace with userid later
  let nutritionRecords = await NutritionRecord.find({}).exec(); // replace with userid later
  if(nutritionData.err) throw nutritionData.err;
  if(nutritionRecords.err) throw nutritionRecords.err;
  res.send({ nutritionData: nutritionData, nutritionRecords: nutritionRecords});
})

// app.post("/updateSheetConfiguration", async (req, res) => {
//   let sheet = req.body.data;
//   let deletedExerciseIds = sheet.DeletedExercisesId;
//
//   let sheetObj = new WorkoutSheet(sheet);
//
//   let updateSheet = await WorkoutSheet.update({ _id: sheet._id }, sheetObj).exec();
//   if(updateSheet.err) throw updateSheet.err;
//
//   if(deletedExerciseIds.length > 0){
//
//     let recordsOfDeletedExercises = await WorkoutRecord.find({ Columns: { $in: deletedExerciseIds }}).exec();
//     if(recordsOfDeletedExercises.err) throw findRecordsOfDeletedExercises.err;
//     else{
//       for(let i = 0; i < recordsOfDeletedExercises.length; i++){
//         for(let j = 0; j < deletedExerciseIds.length; j++){
//             let index = recordsOfDeletedExercises[i].Columns.indexOf(deletedExerciseIds[j]);
//             recordsOfDeletedExercises[i].Values.splice(index, 1);
//             recordsOfDeletedExercises[i].Columns.splice(index, 1);
//             recordsOfDeletedExercises[i].save();
//         }
//       }
//     }
//   }
//
//   res.send();
// })
//
app.post("/addNutritionRecord", async (req, res) => {
  let record = req.body.data;

  let upsertRecord = await NutritionRecord.update({ Date: record.Date }, {
    $set: {
      Values: record.Values,
      Columns: record.Columns
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
//

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
      Columns: record.Columns
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
