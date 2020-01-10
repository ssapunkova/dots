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
//
// app.get("/getSheetExercises/:sheetId", async (req, res) => {
//   let sheetId = req.params.sheetId;
//
//   let exercises = await WorkoutSheet.find({ _id: sheetId}).select("Title, Structure").exec();
//   if(exercises.err) throw exercises.err;
//   res.send(exercises);
// })
//
// app.get("/getExerciseTimes/:sheetId", async (req, res) => {
//   let sheetId = req.params.sheetId;
//
//   let exerciseTimes = await WorkoutRecord.find(
//     {
//       SheetId: sheetId,
//       Time: { $ne: null }
//     }
//   ).select("Time").exec();
//   if(exerciseTimes.err) throw exerciseTimes.err;
//   res.send(exerciseTimes);
// })
//
// app.post("/createSheet", async (req, res) => {
//   let data = req.body.data;
//   let sheet = new WorkoutSheet(data);
//
//   let saveSheet = await sheet.save();
//   if(saveSheet.err) throw saveSheet.err;
//   else res.send(sheet);
// })
//
// app.post("/deleteSheet", async (req, res) => {
//   let sheetId = req.body.sheetId;
//
//   let removeSheet = await WorkoutSheet.findOne({ _id: ObjectId(sheetId)}).remove();
//   let removeSheetRecords = WorkoutRecord.find({ SheetId: ObjectId(sheetId)}).remove();
//   if(removeSheet.err) throw removeSheet.err;
//   else if(removeSheetRecords.err) throw removeSheetRecords.err;
//   else res.send();
//
// })
//
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
// app.post("/addWorkoutRecord", async (req, res) => {
//   let record = req.body.data;
//
//   let upsertRecord = await WorkoutRecord.update({ Date: record.Date }, {
//     $set: {
//       SheetId: record.SheetId,
//       Values: record.Values,
//       Columns: record.Columns,
//       Time: record.Time
//     }
//   }, { upsert: true });
//
//   if(upsertRecord.err) throw upsertRecord.err;
//   else{
//     if(upsertRecord.upserted != undefined){
//       if(upsertRecord.upserted[0]._id != undefined){
//         record._id = upsertRecord.upserted[0]._id;
//       }
//     }
//     res.send({ record: record, docs: upsertRecord });
//   }
// })
//
//
// app.post("/editWorkoutRecord", async (req, res) => {
//   let record = req.body.data;
//
//   // Remove existing record with the same date
//
//   let removedRecords = await WorkoutRecord.remove({
//     Date: record.Date,
//     _id: { $ne: ObjectId(record.RecordId) }
//   })
//
//   let updateRecord = await WorkoutRecord.update({ _id: ObjectId(record.RecordId) }, {
//     $set: {
//       Date: record.Date,
//       Values: record.Values,
//       Columns: record.Columns
//     }
//   })
//   if(removedRecords.err) throw removedRecords.err;
//   else if(updateRecord.err) throw updateRecord.err;
//   else res.send({ deletedDocs: removedRecords.deletedCount });
//
// })
//
//
// app.post("/deleteWorkoutRecord", async (req, res) => {
//   let recordId = req.body.recordId;
//
//   let deleteRecord = await WorkoutRecord.findOneAndDelete({_id: ObjectId(recordId)})
//   if(deleteRecord.err) throw deleteRecord.err;
//   else res.send();
// })
