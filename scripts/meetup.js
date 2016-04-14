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

var API_KEY = process.env.MEETUP_API_KEY;
var groups = require('../meetup-groups.json');
var moment = require('moment-timezone');
moment.locale('en-gb');

module.exports = function (robot) {
  var result;
  var allGroupIds = groups.map(function (group) {
    return group.id;
  }).join('%2C');

  function phraseToId(phrase) {
    for (var i = 0; i < groups.length; i++) {
      for (var j = 0; j < groups[i].aliases.length; j++) {
        if (phrase.indexOf(groups[i].aliases[j]) >= 0) {
          return groups[i].id;
        }
      }
    }
    return null;
  }

  function createMeetupUrl(groupIds) {
    return "https://api.meetup.com/2/events?offset=0&format=json&limited_events=False&group_id=" + groupIds + "&only=venue%2Cgroup%2Ctime%2Cevent_url%2Cname%2Cyes_rsvp_count%2Crsvp_limit&photo-host=secure&page=1&fields=&order=time&status=upcoming&desc=false&key=" + API_KEY;
  }

  robot.hear(/^(?:when|what)(?:s|'s| is) the next (.*)(?:meetup|event|talk|party|hack|shindig|gathering|meeting|happening)/i, function (msg) {
    var room = msg.message.room.toLowerCase();
    var community = msg.match[1].toLowerCase();
    var meetupGroupId = phraseToId(community) || phraseToId(room);
    var knownGroup = true;
    if (!meetupGroupId) {
      knownGroup = false;
      meetupGroupId = allGroupIds;
    }
    var meetupURL = createMeetupUrl(meetupGroupId);
    var groupName = '';
    if (knownGroup) {
      groupName = groups.filter(function (group) {
        return group.id === meetupGroupId;
      })[0].name;
    }

    console.log('Room: ' + room);
    console.log('Community: ' + community);
    console.log('MeetupURL: ' + meetupURL);

    robot.http(meetupURL).get()(function (err, res, body) {
      if (err) console.log(err);
      result = JSON.parse(body).results;
      if (result && result.length > 0) {
        msg.send(responseForEvent(result[0], knownGroup));
      } else {
        msg.send("No upcoming " + groupName + " events planned");
      }
    });
  });
}

function responseForEvent(event, knownGroup) {
  var eventUrl = event.event_url;
  var eventTime = moment(event.time).tz('Europe/London').format('Do MMMM [at] h:mma');
  var eventName = event.name;
  var groupName = event.group.name;
  var message;
  if (knownGroup) {
    message = 'The next ' + groupName + ' meetup is ';
  } else {
    message = 'The next meetup is by *' + groupName + '*, ';
  }
  message += '"*' + eventName + '*" on the *' + eventTime + '*. ';
  if (event.venue && event.venue.name) {
    message += 'It\'s at *' + event.venue.name + '*. ';
  }
  if (event.yes_rsvp_count) {
    if (event.rsvp_limit) {
      message += 'There are ' + (event.rsvp_limit - event.yes_rsvp_count) + ' places left. ';
    } else {
      message += event.yes_rsvp_count + ' people are going so far. ';
    }
  }
  message += '\nMore info: ' + eventUrl;
  return message;
}
