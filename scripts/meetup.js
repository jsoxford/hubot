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
//   how many members do we have? - returns the number of meetup members

module.exports = function(robot) {
  var membersQuery = "https://api.meetup.com/2/members?offset=0&format=json&group_id=17778422&only=photo%2Cname%2Clink&photo-host=secure&page=200&order=name&sig_id=153356042&sig=4d8e3265b4374b84aabb8efcc26eb8107a3ec81b";
  var upcomingEventsQuery = "https://api.meetup.com/2/events?offset=0&format=json&limited_events=False&group_id=17778422&only=time%2Cevent_url%2Cname%2Cdescription%2Cyes_rsvp_count%2Crsvp_limit&photo-host=secure&page=20&fields=&order=time&desc=false&status=upcoming&sig_id=153356042&sig=84e9ac6ce37bdb3c00e4f82fe5a7ce798865fbe4";
  var meetupCheckInterval, result;
  var room = "jsoxford/jsoxford.github.com";

  meetupCheckInterval = setInterval(function(){
    robot.http(membersQuery).get()(function(err, res, body){
      if(err) console.log(err);
      result = JSON.parse(body).results;
      if(result && result.length !== robot.brain.get("membercount")){
        robot.send(room, "We now have " + result.length + " JSOxforders!");
        robot.brain.set("membercount",result.length);
      }
    });
  }, 3600000);

  robot.respond(/how many members do we have\?/i, function(msg){
    msg.send("We have "+ robot.brain.get("membercount") +" awesome members!");
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
