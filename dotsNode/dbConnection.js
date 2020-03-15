// Url of the database

const mongoose = require('mongoose');

// Depends on const online
const online = false;
// const online = true;

let baseUrl = "mongodb://localhost:27017/dots";
if(online == true){
    baseUrl = "mongodb+srv://admin:admEleKi_02.20@cluster0-wln1h.mongodb.net/test?retryWrites=true&w=majority";
}

const connectParams = { dbName: "dots", useNewUrlParser: true };

// Connect to mongoose
mongoose.connect(baseUrl, connectParams);
let db = mongoose.connection;
db.on('error', (err) => {
  console.error.bind(console, 'connection error:');
  throw err;
});
