var telegram = require('telegram-bot-api');
var token = require('../config.json').bot_token;
var db = require("mongo_schemas");
var api = new telegram({
    token: token || "<API TOKEN>",
    updates: {
        enabled: true
    }
});

var menu = "Wellcome to Sadjad ACM Scoreboard \n" +
    "1- type /start to see menu \n" +
    "2- type  /my_score to see your rating on scoreboard \n" +
    "3- type /codeforces_rating to see your codeforces rating \n" +
    "4- type /codeforces_max_rating to see your maximum codeforces rating \n" +
    "5- type /codeforces_ranking to see your codeforces ranking \n" +
    "6- type /codeforces_max_ranking to see your maximum codeforces ranking \n" +
    "7- type /change-new_username to change your current username \n";
api.on('message', function(message)
{
    var first_name = message.from.first_name,
    last_name = message.from.first_name,
    user_id = message.from.id,
    chat_id = message.chat.id,
    username = message.from.username,
    name = username || first_name || last_name,
    text = message.text;
    db.bot_username.findOne({user_telegram_id :user_id},{}).lean().exec(function(err,res){
       if(err){
            console.mongo("Error " +err);
           reply(chat_id,"Sorry internal server error!",name);

       } else{
           if(res){
               db.users.findOne({codeforces_lower : res.codeforces_username.toLowerCase() , _verify : true},{}).lean().exec(function(err2,user){
                   if(err2){
                       console.mongo("Error " +err2);
                       reply(chat_id,"Sorry internal server error!",name);
                   }
                   else{
                       if(text.indexOf("/change") == 0 && text.indexOf('-') == 7){
                           var new_username = text.slice(8);
                           if(new_username.length > 2 && new_username.length < 25  && /^[a-zA-Z0-9-_]*$/.test(new_username) == true){
                               if(typeof new_username != 'undefined'){
                                   db.users.findOne({codeforces_lower : new_username.toLowerCase()},{}).lean().exec(function(err3,user){
                                       if(err3){
                                           console.mongo("Error " +err3);
                                           reply(chat_id,"Sorry internal server error!",name);
                                       }
                                       else if(user){
                                           res.codeforces_username = new_username;
                                           db.bot_username.remove({user_telegram_id :user_id},function(err4){
                                               if(err4){
                                                   console.mongo("Error " +err4);
                                                   reply(chat_id,"Sorry internal server error!",name);
                                               } else{
                                                   db.bot_username(res).save(function(err5){
                                                       if(err5){
                                                           console.mongo("Error " +err5);
                                                           reply(chat_id,"Sorry internal server error!",name);
                                                       }
                                                       else{
                                                           reply(chat_id,"Your codeforces username updated",name);
                                                       }
                                                   });
                                               }
                                           });
                                       }
                                       else{
                                           reply(chat_id,"Your new codeforces username is not in Sadjad ACM Scoreboard",name);
                                       }
                                   });
                               }
                               else{
                                   reply(chat_id,"This can not be a codeforces username",name);
                               }
                           }
                           else{
                               reply(chat_id,"This can not be a codeforces username",name);
                           }
                       }
                       else if(text == '/start')reply(chat_id,menu,name);
                       else if(text == '/my_score'){
                           reply(chat_id,"Your score is " + user.score,name);
                       }
                       else if(text == '/codeforces_rating'){
                           reply(chat_id,"Your codeforces rating is " + user.rating,name);
                       }
                       else if(text == '/codeforces_max_rating'){
                           reply(chat_id,"Your maximum codeforces rating is " + user.maxRating,name);
                       }
                       else if(text == '/codeforces_ranking'){
                           reply(chat_id,"Your codeforces ranking is " + user.rank,name);
                       }
                       else if(text == '/codeforces_max_ranking'){
                           reply(chat_id,"Your maximum codeforces ranking is " + user.maxRank,name);
                       }
                       else{
                           reply(chat_id,"Sorry unrecognized command :(",name);
                       }
                   }
               });
           }
           else{
               if(text == '/start' || text == '/codeforces_max_ranking' || text == '/codeforces_ranking' || text == '/codeforces_max_rating' || text == '/codeforces_rating' || text == '/my_score'){
                   reply(chat_id,"Please inter your codeforces username first",name);
               }
               else if(text.indexOf("/change") == 0 && text.indexOf('-') == 7){
                   reply(chat_id,"Please inter your codeforces username first then you can decide to change it :)",name);
               }
               else{
                   if(text.length > 2 && text.length < 25 && /^[a-zA-Z0-9-_]*$/.test(text) == true){
                       db.users.findOne({codeforces_lower : text.toLowerCase()  , _verify : true},{}).lean().exec(function(err3,user){
                          if(err3){
                              console.mongo("Error " +err3);
                              reply(chat_id,"Sorry internal server error!",name);
                          } else{
                              if(user){
                                  var codeforces_usre = {
                                      user_telegram_id : user_id,
                                      codeforces_username: text
                                  };
                                  db.bot_username(codeforces_usre).save(function(err4){
                                      if(err4){
                                          console.mongo("Error " +err4);
                                          reply(chat_id,"Sorry internal server error!",name);
                                      }
                                      else{
                                          reply(chat_id,menu,name);
                                      }
                                  });
                              }
                              else{
                                  reply(chat_id,"Your codeforces username is not in Sadjad ACM Scoreboard",name);
                              }
                          }
                       });
                   }
                   else{
                       reply(chat_id,"This can not be a codeforces username",name);
                   }
               }
           }
       }
    });
});
function reply(chat_id, text, name) {
    api.sendMessage({
        chat_id: chat_id,
        text: text
    }, function(err,m) {
        console.mongo("Error " + err);
    });
}