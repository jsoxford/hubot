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

module.exports = function (robot) {
  var API_KEY = process.env.MEETUP_API_KEY;

  var multipleEvents = "https://api.meetup.com/2/events?offset=0&format=json&limited_events=False&group_id=1722581%2C17778422%2C19558444%2C12345482%2C18829161%2C18789928%2C18617250%2C18888248&only=venue%2Cgroup%2Ctime%2Cevent_url%2Cname%2Cyes_rsvp_count%2Crsvp_limit&photo-host=secure&page=1&fields=&order=time&status=upcoming&desc=false&key=" + API_KEY;
  var jsOxfordEvents = "https://api.meetup.com/2/events?offset=0&format=json&limited_events=False&group_id=17778422&only=venue%2Cgroup%2Ctime%2Cevent_url%2Cname%2Cyes_rsvp_count%2Crsvp_limit&photo-host=secure&page=1&fields=&order=time&status=upcoming&desc=false&key=" + API_KEY;
  var uxOxfordEvents = "https://api.meetup.com/2/events?offset=0&format=json&limited_events=False&group_id=12345482&only=venue%2Cgroup%2Ctime%2Cevent_url%2Cname%2Cyes_rsvp_count%2Crsvp_limit&photo-host=secure&page=1&fields=&order=time&status=upcoming&desc=false&key=" + API_KEY;
  var phpOxfordEvents = "https://api.meetup.com/2/events?offset=0&format=json&limited_events=False&group_id=18829161&only=venue%2Cgroup%2Ctime%2Cevent_url%2Cname%2Cyes_rsvp_count%2Crsvp_limit&photo-host=secure&page=1&fields=&order=time&status=upcoming&desc=false&key=" + API_KEY;
  var dockerEvents = "https://api.meetup.com/2/events?offset=0&format=json&limited_events=False&group_id=18789928&only=venue%2Cgroup%2Ctime%2Cevent_url%2Cname%2Cyes_rsvp_count%2Crsvp_limit&photo-host=secure&page=1&fields=&order=time&status=upcoming&desc=false&key=" + API_KEY;
  var rubyEvents = "https://api.meetup.com/2/events?offset=0&format=json&limited_events=False&group_id=18617250&only=venue%2Cgroup%2Ctime%2Cevent_url%2Cname%2Cyes_rsvp_count%2Crsvp_limit&photo-host=secure&page=1&fields=&order=time&status=upcoming&desc=false&key=" + API_KEY;
  var pythonEvents = "https://api.meetup.com/2/events?offset=0&format=json&limited_events=False&group_id=1722581&only=venue%2Cgroup%2Ctime%2Cevent_url%2Cname%2Cyes_rsvp_count%2Crsvp_limit&photo-host=secure&page=1&fields=&order=time&status=upcoming&desc=false&key=" + API_KEY;
  var doxfordEvents = "https://api.meetup.com/2/events?offset=0&format=json&limited_events=False&group_id=19558444&only=venue%2Cgroup%2Ctime%2Cevent_url%2Cname%2Cyes_rsvp_count%2Crsvp_limit&photo-host=secure&page=1&fields=&order=time&status=upcoming&desc=false&key=" + API_KEY;
  var optimiseEvents = "https://api.meetup.com/2/events?offset=0&format=json&limited_events=False&group_id=18888248&only=venue%2Cgroup%2Ctime%2Cevent_url%2Cname%2Cyes_rsvp_count%2Crsvp_limit&photo-host=secure&page=1&fields=&order=time&status=upcoming&desc=false&key=" + API_KEY;
  var result;

  function phraseToUrl(phrase) {
    if (phrase.indexOf('js') >= 0 || phrase.indexOf('javascript') >= 0) {
      return jsOxfordEvents;
    } else if (phrase.indexOf('ux') >= 0) {
      return uxOxfordEvents;
    } else if (phrase.indexOf('php') >= 0) {
      return phpOxfordEvents;
    } else if (phrase.indexOf('docker') >= 0) {
      return dockerEvents;
    } else if (phrase.indexOf('ruby') >= 0 || phrase.indexOf('rb') >= 0) {
      return rubyEvents;
    } else if (phrase.indexOf('py') >= 0) {
      return pythonEvents;
    } else if (phrase.indexOf('dox') >= 0 || phrase.indexOf('devop') >= 0) {
      return doxfordEvents;
    } else if (phrase.indexOf('optim') >= 0) {
      return optimiseEvents;
    } else {
      return null;
    }
  }

  robot.hear(/^(?:when|what)(?:s|'s| is) the next (.*)(?:meetup|event|talk|party|hack|shindig|gathering|meeting|happening)/i, function (msg) {
    var room = msg.message.room.toLowerCase();
    var community = msg.match[1].toLowerCase();
    var meetupURL = phraseToUrl(community) || phraseToUrl(room) || multipleEvents;

    console.log('Room: ' + room);
    console.log('Community: ' + community);
    console.log('MeetupURL: ' + meetupURL);

    robot.http(meetupURL).get()(function (err, res, body) {
      if (err) console.log(err);
      result = JSON.parse(body).results;
      if (result && result.length > 0) {
        msg.send(responseForEvent(result[0], meetupURL !== multipleEvents));
      } else {
        msg.send("No upcoming events planned");
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
