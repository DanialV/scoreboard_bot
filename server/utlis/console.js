/**
 * Created by Danial Vafadar on 7/29/15.
 */
///Over ride console functions
var db = require("mongo_schemas");
console.error = function(text){
    var date = new Date();
    console.log("Date : " + date.getDate() + "/" + date.getMonth() + "/" + date.getFullYear() +
        " " + date.getHours() + " : " + date.getMinutes() + " : " + date.getSeconds() + " ----> Error : " + text );
};
console.mongo = function(text){
    var date = new Date();
    var logs = {};
    text = "Date : " + date.getDate() + "/" + date.getMonth() + "/" + date.getFullYear() +
    " " + date.getHours() + " : " + date.getMinutes() + " : " + date.getSeconds() + " ---> "+text;
    logs.log = text;
    db.logs(logs).save(function(err,doc){
       if(err){
           console.error(err);
       }
    });
};
console.info = function(text){
    var date = new Date();
    console.log(date.getHours() + " : " + date.getMinutes() + " : " + date.getSeconds() + " ----> " + text );
};
