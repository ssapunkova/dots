const http = require('http');
const express = require('express');
const app = express();
const cookieParser = require('cookie-parser');
const cors = require('cors');

const port = process.env.PORT || 8080;
// const appUrl = 'http://localhost:8100';
// const appUrl = "https://dots-ionic.now.sh";
// const appUrl = "https://dotsapp-58afb.firebaseapp.com";


app.use(express.static('public'));
app.use(express.json());
app.set('view engine', 'ejs');
app.use(cookieParser());

app.use(cors());


app.get("/", async (req, res) => {
  res.send("a");
})

// // Function for requiring files from root folder
// global.base_dir = __dirname;
// global.abs_path = function(path) {
//   return base_dir + path;
// }
// global.include = function(file) {
//   return require(abs_path('/' + file));
// }

const dbConnection = require('./dbConnection');

// // Add headers
// app.use(function (req, res, next) {

//     // Website you wish to allow to connect
//     res.setHeader('Access-Control-Allow-Origin', appUrl);

//     // Request methods you wish to allow
//     res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

//     // Request headers you wish to allow
//     res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

//     // Set to true if you need the website to include cookies in the requests sent
//     // to the API (e.g. in case you use sessions)
//     res.setHeader('Access-Control-Allow-Credentials', true);

//     // Pass to next layer of middleware
//     next();
// });


// Require routes
app.use(require("./routes/login"));
app.use(require("./routes/register"));
app.use(require("./routes/workouts"));
app.use(require("./routes/nutrition"));
app.use(require("./routes/calculate"));



let server = app.listen(port, function(){
  
  let host = server.address().address;
  let port = server.address().port;

  console.log("Dots are dotting at " + host + " on port " + port);
})
