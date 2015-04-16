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
//   hubot when is the next event ?  - returns the next upcoming meetup event

module.exports = function(robot) {
    robot.respond(/when(s|'s| is) the next (meetup|event|jsoxford)\s?\?/i, function(msg){
        var upcomingEventsQuery = "https://api.meetup.com/2/events?offset=0&format=json&limited_events=False&group_id=17778422&only=time%2Cevent_url%2Cname%2Cdescription%2Cyes_rsvp_count%2Crsvp_limit&photo-host=secure&page=20&fields=&order=time&desc=false&status=upcoming&sig_id=153356042&sig=84e9ac6ce37bdb3c00e4f82fe5a7ce798865fbe4";
        robot.http(upcomingEventsQuery).get()(function(err, res, body){
          if(err) console.log(err);
          var upcomingEvents = JSON.parse(body).results;
          if(upcomingEvents && upcomingEvents.length > 0){
            msg.send(upcomingEvents[0].event_url);
          }else{
            msg.send("No upcoming events planned");
          }
        });
    });
}
