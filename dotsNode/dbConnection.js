// Url of the database

const mongoose = require('mongoose');

// Depends on const online
const online = false;
// const online = true;

const baseUrl = "mongodb://localhost:27017/dots";
if(online == true){
    baseUrl = "";
}

const connectParams = { dbName: "dots", useNewUrlParser: true };

// Connect to mongoose
mongoose.connect(baseUrl, connectParams);
let db = mongoose.connection;
db.on('error', (err) => {
  console.error.bind(console, 'connection error:');
  throw err;
});
