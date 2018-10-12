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
  var allGroupIds = Object.keys(groups);
  var eventsRoom = "#events";
  
  const checkForNewMeetup = () => {
    console.log("Checking for new meetups");
    allGroupIds.forEach((groupId, index) => {
      const delay = 60000 * (index/allGroupIds.length); // To spread over a minute
      setTimeout(function() {
        var meetupURL = `https://api.meetup.com/2/events?offset=0&format=json&limited_events=False&group_id=${groupId}&only=id%2Ccreated%2Ctime%2Cevent_url%2Cname%2Cdescription%2Cyes_rsvp_count%2Crsvp_limit%2Cgroup&photo-host=secure&page=1&fields=&order=time&status=upcoming&desc=false&key=${API_KEY}`;
        console.log(`Requesting new meetups for ${groupId}`);
        robot.http(meetupURL).get()(function(err, res, body) {
          if(err) {
            console.log(err);
            return;
          }
          if (res.statusCode !== 200) {
            console.log(`Response statusCode is ${res.statusCode}`);
            res.headers.keys.filter(key => key.includes('ratelimit')).forEach(key => {
              console.log(`${key}: ${res.headers.keys[key]}`);
            });
            return;
          }

          try {
            const result = JSON.parse(body).results;

            if(result && result.length > 0) {
              const lastResult = robot.brain.get(`next-${groupId}`);
              if (lastResult) {
                // There should only be 1 result here (due to the page=1 in the Meetup URL)
                if (lastResult !== result[0].id) {
                  var announcement = generateAnnouncement(result[0], groups);
                  robot.messageRoom(eventsRoom, announcement);
                  if (groups[result[0].group.id].slack_channel) {
                    robot.messageRoom(groups[result[0].group.id].slack_channel, announcement);
                  }
                }
              }

              console.log(`Next for meetup ${groupId}: ${result[0].id}`);

              // Store next meetup ID for that group
              robot.brain.set(`next-${groupId}`, result[0].id);
            } else {
              console.log(`Next for meetup ${groupId}: -`);
              robot.brain.set(`next-${groupId}`, '-');
            }
          } catch(err) {
            console.log(err, body);
            return;
          }
        });
      }, delay);
    });
  };

  // Checks for new meetups straight away, then once an hour.
  checkForNewMeetup();
  setInterval(checkForNewMeetup, 1000 * 3600);
}

function outOfOxford(group) {
  if (group.outOfOxford) {
    return ' This meetup takes place outside of Oxford.'
  }
  return '';
}

function generateAnnouncement(event, groups) {
  var differentYear = moment(event.time).year() !== moment().year();
  var eventTime = moment(event.time).tz('Europe/London').format(`dddd Do MMMM ${differentYear ? 'YYYY ' : ''}[at] h:mma`);
  return `${emoji('announce')} Next *${groups[event.group.id].name}* meetup:
"${event.name}" is on ${eventTime}.${outOfOxford(groups[event.group.id])}
${event.event_url}
Find a buddy to go with in <#C3T52T9NV|meetup-buddies>`
}
