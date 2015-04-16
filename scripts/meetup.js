// Description:
//   meetup script
//
// Dependencies:
//   None
//
// Configuration:
//   None
//
// Commands:
//   when is the next event ?  - returns the next upcoming meetup event
//   hubot keep an eye on members - returns when meetup

module.exports = function(robot) {
  var membersQuery = "https://api.meetup.com/2/members?offset=0&format=json&group_id=17778422&only=photo%2Cname%2Clink&photo-host=secure&page=200&order=name&sig_id=153356042&sig=4d8e3265b4374b84aabb8efcc26eb8107a3ec81b";
  var upcomingEventsQuery = "https://api.meetup.com/2/events?offset=0&format=json&limited_events=False&group_id=17778422&only=time%2Cevent_url%2Cname%2Cdescription%2Cyes_rsvp_count%2Crsvp_limit&photo-host=secure&page=20&fields=&order=time&desc=false&status=upcoming&sig_id=153356042&sig=84e9ac6ce37bdb3c00e4f82fe5a7ce798865fbe4";
  var meetupCheckInterval, result;

  robot.respond(/keep (an eye on|track of) member(s| count)/i, function(msg){
    if(meetupCheckInterval){
      msg.send("Already on it!");
      return;
    }else{
      msg.send("Will do!");
    }
    meetupCheckInterval = setInterval(function(){
      robot.http(membersQuery).get()(function(err, res, body){
        if(err) console.log(err);
        result = JSON.parse(body).results;
        if(result && result.length !== robot.brain.get("membercount") && result.length % 50 === 0){
          msg.send("We now have " + result.length + " JSOxforders!");
          robot.brain.set("membercount",result.length);
        }
      });
    }, 3600000);
  });

  robot.respond(/stop checking members/i, function(msg){
    clearInterval(meetupCheckInterval);
    meetupCheckInterval = undefined;
    msg.send("I'll no longer check for new members");
  });

  robot.hear(/when(s|'s| is) the next (meetup|event|jsoxford)\s?\?/i, function(msg){
    robot.http(upcomingEventsQuery).get()(function(err, res, body){
      if(err) console.log(err);
      result = JSON.parse(body).results;
      if(result && result.length > 0){
        msg.send(result[0].event_url);
      }else{
        msg.send("No upcoming events planned");
      }
    });
  });
}
