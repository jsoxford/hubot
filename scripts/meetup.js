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
//   When's the next event? - returns the next upcoming meetup event
//   When's the next [group] event? - returns the next Meetup event for a given group e.g. "When's the next JSOxford meetup?"

var emoji = require('../lib/digitaloxfordemoji');
var moment = require('moment-timezone');
moment.locale('en-gb');

module.exports = function (robot) {
  var results;
  var API_KEY = process.env.MEETUP_API_KEY;
  var groups = require('../meetup-groups.json');
  var allGroupIds = Object.keys(groups).join('%2C');

  function processMessage(msg) {
    var room = msg.message.room.toLowerCase();
    var community = msg.match[1].toLowerCase();
    var meetupGroupId = phraseToId(community, groups) || phraseToId(room, groups);
    var knownGroup = true;
    var groupName;
    if (!meetupGroupId) {
      knownGroup = false;
      meetupGroupId = allGroupIds;
    }
    var meetupURL = createMeetupUrl(meetupGroupId, API_KEY);

    console.log(`Room: ${room}`);
    console.log(`Community: ${community}`);
    console.log(`MeetupURL: ${meetupURL}`);

    robot.http(meetupURL).get()(function (err, res, body) {
      if (err) console.log(err);
      results = JSON.parse(body).results;
      if (results && results.length > 0) {
        groupName = groups[results[0].group.id].name;
        msg.send(responseForEvent(results[0], groupName, knownGroup));
      } else {
        groupName = knownGroup ? groups[meetupGroupId].name + ' ' : '';
        msg.send(`No upcoming ${groupName}events planned ${emoji('sad')}`);
      }
    });
  }

  function meetupInfo(msg) {
    var eventId = msg.match[1];
    var meetupInfoUrl = createMeetupInfoUrl(eventId, API_KEY);
    robot.http(meetupInfoUrl).get()(function (err, res, body) {
      if (err) console.log(err);
      var results = JSON.parse(body).results;
      if (results && results.length > 0) {
        msg.send(meetupInfoResponse(results[0]));
      } else {
        msg.send('That event doesn\'t exist.');
      }
    });
  }

  robot.hear(/^(?:when|what)(?:.?s| is) the next (.*)(?:meet up|meetup|event|talk|party|hack|shindig|gathering|meeting|happening)/i, processMessage);
  robot.hear(/^(?:are|is) there (?:any|a) (.*)(?:meet up|meetup|event|talk|party|hack|shindig|gathering|meeting|happening)/i, processMessage);
  robot.respond(/(?:when|what)(?:.?s| is) the next (.*)(?:meet up|meetup|event|talk|party|hack|shindig|gathering|meeting|happening)/i, processMessage);
  robot.hear(/meetup\.com\/[^\/]+\/events\/(\d+)/i, meetupInfo);
}


function responseForEvent(event, groupName, knownGroup) {
  var eventUrl = event.event_url;
  var message;
  if (knownGroup) {
    message = `The next *${groupName}* meetup is `;
  } else {
    message = `The next meetup is by *${groupName}*, `;
  }
  message += eventDetails(event);
  message += '\n' + eventUrl;
  return message;
}

function isWas(event) {
  return event.status==="past" ? 'was' : 'is';
}

function meetupInfoResponse(event) {
  return `That event ${isWas(event)} ${eventDetails(event)}`;
}

function eventDetails(event) {
  var eventTime = moment(event.time).tz('Europe/London').format('dddd Do MMMM YYYY [at] h:mma');
  output = `"${event.name}" on ${eventTime}. `;
  if (event.venue && event.venue.name) {
    output += `It ${isWas(event)} at ${event.venue.name} (${event.venue.city}). `;
  }
  if (event.yes_rsvp_count && event.status === "upcoming") {
    if (event.rsvp_limit && event.rsvp_limit - event.yes_rsvp_count <= 10) {
      output += `There are ${event.rsvp_limit - event.yes_rsvp_count} places left. `;
    }
  }
  if (event.outOfOxford) {
    output += `This meetup takes place outside of Oxford. `;
  }
  return output;
}

function phraseToId(phrase, groups) {
  var groupIds = Object.keys(groups);

  for (var i = 0; i < groupIds.length; i++) {
    for (var j = 0; j < groups[groupIds[i]].aliases.length; j++) {
      if (phrase.indexOf(groups[groupIds[i]].aliases[j].toLowerCase()) >= 0) {
        return groupIds[i];
      }
    }
  }
  return null;
}

function createMeetupUrl(groupIds, API_KEY) {
  return `https://api.meetup.com/2/events?offset=0&format=json&limited_events=False&group_id=${groupIds}&only=venue%2Cgroup%2Ctime%2Cevent_url%2Cname%2Cyes_rsvp_count%2Crsvp_limit&photo-host=secure&page=1&fields=&order=time&status=upcoming&desc=false&key=${API_KEY}`;
}

function createMeetupInfoUrl(eventId, API_KEY) {
  return `https://api.meetup.com/2/events?offset=0&format=json&limited_events=False&event_id=${eventId}&page=500&fields=&order=time&desc=false&status=upcoming&key=${API_KEY}`;
}
