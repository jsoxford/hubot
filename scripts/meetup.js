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
  var membersQuery = "https://api.meetup.com/2/groups?offset=0&format=json&group_id=17778422&only=members&photo-host=public&page=20&radius=25.0&fields=&order=id&desc=false&sig_id=153356042&sig=28665c8075d8715f5aaf4620e39a1c362234c1e3";
  var upcomingEventsQuery = "https://api.meetup.com/2/events?offset=0&format=json&limited_events=False&group_id=17778422&only=time%2Cevent_url%2Cname%2Cdescription%2Cyes_rsvp_count%2Crsvp_limit&photo-host=secure&page=20&fields=&order=time&desc=false&status=upcoming&sig_id=153356042&sig=84e9ac6ce37bdb3c00e4f82fe5a7ce798865fbe4";
  var meetupCheckInterval, result;
  var room = "jsoxford/jsoxford.github.com";
  var adjectives = ["awesome","amazing","JS-tastic","super","cool","incredible"];

  function fetchMemberCount(callback){
    var memberCount;
    robot.http(membersQuery).get()(function(err, res, body){
      if(err) console.log(err);
      result = JSON.parse(body).results;
      if(result && result[0]){
        callback(result[0].members); 
      }
    });
  }

  meetupCheckInterval = setInterval(function(){
    fetchMemberCount(function(count){
      if(count && count !== robot.brain.get("membercount")){
        robot.messageRoom(room, "We now have " + count + " JSOxforders!");
        robot.brain.set("membercount",count);
      }
    });
  }, 3600000);

  robot.respond(/how many members do we have\?/i, function(msg){
    fetchMemberCount(function(count){
      msg.send("We have "+ count +" "+ msg.random(adjectives)+" members!");
    })
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
