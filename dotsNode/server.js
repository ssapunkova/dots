const http = require('http');
const express = require('express');
const app = module.exports = express();
const cookieParser = require('cookie-parser');

const port = process.env.PORT || 8080;
const appUrl = 'http://localhost:8100';

app.use(express.static('public'));
app.use(express.json());
app.set('view engine', 'ejs');
app.use(cookieParser());

// Function for requiring files from root folder
global.base_dir = __dirname;
global.abs_path = function(path) {
  return base_dir + path;
}
global.include = function(file) {
  return require(abs_path('/' + file));
}

const dbConnection = include('dbConnection');

// Add headers
app.use(function (req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', appUrl);

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
});

// Require routes
require("./routes/login");
require("./routes/register");
require("./routes/workouts");
require("./routes/nutrition");
require("./routes/calculate");

app.get('/', function(req, res) {
    res.render("login")
})


app.get('/logout', function(req, res){
  console.log("a");
  res.clearCookie("DotsUserId");
  res.clearCookie("DotsUsername");
  res.redirect('/login');
})

app.listen(port, function(){
    console.log("Dots are dotting on port " + port );
})
