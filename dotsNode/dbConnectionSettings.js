// Url of the database

// Depends on const online
const online = false;
// const online = true;

var baseUrl = "mongodb://localhost:27017/dots";
if(online == true){
    baseUrl = "";
}

var connectParams = { dbName: "dots", useNewUrlParser: true };

module.exports = {"baseUrl": baseUrl, "connectParams": connectParams};
