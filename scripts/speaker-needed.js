// Description:
//   Checks for "speaker-needed" issues and lets the chatroom know.
//
// Dependencies:
//   None
//
// Configuration:
//   None
//
// Commands:
//   None

module.exports = function(robot){
  var interval;
  var room = "jsoxford/jsoxford.github.com";
  var issuesURL = "https://api.github.com/repos/jsoxford/jsoxford.github.com/issues?labels=speaker-needed";

  robot.brain.set("lastcheck",new Date());

  interval = setInterval(function(){
    robot.http(issuesURL).get()(function(err, res, body){
        if(err) return console.log('Couldn\'t check github issues: ' + err);
        result = JSON.parse(body);
        if(result){
          result.forEach(function(issue){
            var created = new Date(issue.updated_at);
            if(created > robot.brain.get("lastcheck")){
              var message = "We're looking for an awesome person to speak about " + issue.title + " is that you? Check out #" + issue.number;
              robot.messageRoom(room, message);
            }
          });
        }
        robot.brain.set("lastcheck",new Date());
      });
  }, 3600000);
}