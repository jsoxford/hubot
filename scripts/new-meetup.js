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

var moment = require('moment-timezone');
moment.locale('en-gb');

module.exports = function(robot) {
  var API_KEY = process.env.MEETUP_API_KEY;
  var groups = require('../meetup-groups.json');
  var allGroupIds = groups.map(function(group) {
    return group.id;
  }).join('%2C');

  var meetupURL = "https://api.meetup.com/2/events?offset=0&format=json&limited_events=False&group_id=" + allGroupIds + "&only=created%2Ctime%2Cevent_url%2Cname%2Cdescription%2Cyes_rsvp_count%2Crsvp_limit%2Cgroup&photo-host=secure&page=20&fields=&order=time&status=upcoming&desc=false&key=" + API_KEY;
  var room = "#events";
  var result;

  robot.brain.set("lastcheck",new Date());

  interval = setInterval(function(){
    console.log("Checking for new meetups");

    robot.http(meetupURL).get()(function(err, res, body){
      if(err) console.log(err);
      result = JSON.parse(body).results;

      if(result && result.length > 0){
        result.forEach(function(meetup){
          var created = new Date(meetup.created);
          if(created > robot.brain.get("lastcheck")){
            robot.messageRoom(room, generateAnnouncement(meetup));
          }
        });
      }

      robot.brain.set("lastcheck",new Date());
    });
  }, 1000 * 3600);

}

function generateAnnouncement(event) {
  var eventTime = moment(event.time).tz('Europe/London').format('Do MMMM [at] h:mma');
  var message = ':loudspeaker: New meetup!\n';
  message += '"' + event.name + '" by ' + event.group.name + ', on the ' + eventTime + '\n';
  message += event.event_url;
  return message;
}
