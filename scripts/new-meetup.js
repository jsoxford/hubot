// Description:
//   Checks every hour for new meetups. Posts in the releveant channel (if it exists) and #events
//
// Dependencies:
//   None
//
// Configuration:
//   None

var emoji = require('../lib/digitaloxfordemoji');
var moment = require('moment-timezone');
moment.locale('en-gb');

module.exports = function(robot) {
  var API_KEY = process.env.MEETUP_API_KEY;
  var groups = require('../meetup-groups.json');
  var allGroupIds = Object.keys(groups).join('%2C');

  var meetupURL = `https://api.meetup.com/2/events?offset=0&format=json&limited_events=False&group_id=${allGroupIds}&only=id%2Ccreated%2Ctime%2Cevent_url%2Cname%2Cdescription%2Cyes_rsvp_count%2Crsvp_limit%2Cgroup&photo-host=secure&page=200&fields=&order=time&status=upcoming&desc=false&key=${API_KEY}`;

  var eventsRoom = "#events";

  const checkForNewMeetup = () => {
    console.log("Checking for new meetups");

    robot.http(meetupURL).get()(function(err, res, body){
      if(err) {
        console.log(err);
        return;
      }

      try {
        const result = JSON.parse(body).results;
        if(result && result.length > 0) {
          const lastResult = robot.brain.get('lastResult');
          if (lastResult) {
            result.forEach(function(meetup){
              if (!lastResult.some(prev => prev === meetup.id)) {
                var announcement = generateAnnouncement(meetup, groups);
                robot.messageRoom(eventsRoom, announcement);
                if (groups[meetup.group.id].slack_channel) {
                  robot.messageRoom(groups[meetup.group.id].slack_channel, announcement);
                }
              }
            });
          }

          // Store the keys of each meetup
          robot.brain.set('lastResult', result.map(meetup => meetup.id));
        }
      } catch(err) {
        console.log(err, body);
        return;
      }
    });
  };

  checkForNewMeetup();
  setInterval(checkForNewMeetup, 1000 * 3600);
}

function outOfOxford(event) {
  if (event.outOfOxford) {
    return ' This meetup takes place outside of Oxford. '
  }
  return '';
}

function generateAnnouncement(event, groups) {
  var eventTime = moment(event.time).tz('Europe/London').format('dddd Do MMMM [at] h:mma');
  return `${emoji('announce')} New *${groups[event.group.id].name}* meetup!
"${event.name}" is on ${eventTime} ${outOfOxford(event)}
${event.event_url}
Find a buddy to go with in <#C3T52T9NV|meetup-buddies>`
}
