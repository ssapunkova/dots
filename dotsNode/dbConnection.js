// Url of the database

var mongoose = require('mongoose');

// Depends on const online
const online = false;
// const online = true;

var baseUrl = "mongodb://localhost:27017/dots";
if(online == true){
    baseUrl = "";
}

var connectParams = { dbName: "dots", useNewUrlParser: true };

// Connect to mongoose
mongoose.connect(baseUrl, connectParams);
var db = mongoose.connection;
db.on('error', (err) => {
  console.error.bind(console, 'connection error:');
  throw err;
});
