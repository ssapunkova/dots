var ObjectId = require('mongodb').ObjectID;

var User = include('schemas/userSchema');

// About checkUser.accessPermission
// accessPermission takes id cookie from the browser and checks the user in the db
// if user has required status, functionIfPermited() is executed
// otherwise user is sent to login page

function resSendLogin(res){
    res.render('login', {error: "NoAccessPermission"});
}

function accessPermission(requiredStatus, req, res, functionIfPermited){
    var idCookie = req.cookies.DotsUserId;
    var usernameCookie = req.cookies.DotsUsername;

    if(typeof idCookie == undefined || idCookie == ""){
        resSendLogin(res);
    }
    else{
        mongoose.connect(baseUrl, { useNewUrlParser: true }, function(err, db) {
            User.findOne({_id: ObjectId(idCookie), Username: usernameCookie}, function(err, user) {
                if(err) throw err;
                if(user != null){
                    functionIfPermited();
                }
                else{
                    resSendLogin(res);
                }
            });
        });
    }

}

module.exports = {accessPermission}
