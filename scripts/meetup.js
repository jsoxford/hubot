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
  var multipleEvents = "https://api.meetup.com/2/events?offset=0&format=json&limited_events=False&group_id=1722581%2C17778422%2C19558444%2C12345482%2C18829161%2C18789928%2C18617250&only=group%2Ctime%2Cevent_url%2Cname%2Cdescription%2Cyes_rsvp_count%2Crsvp_limit&photo-host=secure&page=1&fields=&order=time&status=upcoming&desc=false&sig_id=153356232&sig=af9731ddb46270879b5e6eb868ea21ac59d2f080";
  var jsOxfordEvents = "https://api.meetup.com/2/events?offset=0&format=json&limited_events=False&group_id=17778422&only=group%2Ctime%2Cevent_url%2Cname%2Cdescription%2Cyes_rsvp_count%2Crsvp_limit&photo-host=secure&page=1&fields=&order=time&desc=false&status=upcoming&sig_id=153356232&sig=98939e64cf46d1001bc06c897d0f36fef7838594";
  var uxOxfordEvents = "https://api.meetup.com/2/events?offset=0&format=json&limited_events=False&group_urlname=UX-Oxford&only=group%2Ctime%2Cevent_url%2Cname%2Cdescription%2Cyes_rsvp_count%2Crsvp_limit&photo-host=secure&page=1&fields=&order=time&status=upcoming&desc=false&sig_id=153356232&sig=013d15d4371db22fb6da06255632a931ffa3991b";
  var phpOxfordEvents = "https://api.meetup.com/2/events?offset=0&format=json&limited_events=False&group_urlname=PHP-Oxford&only=group%2Ctime%2Cevent_url%2Cname%2Cdescription%2Cyes_rsvp_count%2Crsvp_limit&photo-host=public&page=1&fields=&order=time&status=upcoming&desc=false&sig_id=153356232&sig=f5954a49f72c9085177d7468bfab6ae7e2951d2e";
  var dockerEvents = "https://api.meetup.com/2/events?offset=0&format=json&limited_events=False&group_urlname=docker-oxford&only=group%2Ctime%2Cevent_url%2Cname%2Cdescription%2Cyes_rsvp_count%2Crsvp_limit&photo-host=public&page=1&fields=&order=time&status=upcoming&desc=false&sig_id=153356232&sig=0f347c7cd1eb063e44f0ab226a15a561aec05afd";
  var rubyEvents = "https://api.meetup.com/2/events?offset=0&format=json&limited_events=False&group_urlname=Oxford-Ruby-Users-Group-OxRUG&only=group%2Ctime%2Cevent_url%2Cname%2Cdescription%2Cyes_rsvp_count%2Crsvp_limit&photo-host=public&page=1&fields=&order=time&status=upcoming&desc=false&sig_id=153356232&sig=8c69105da2d8e60903a1e9b9bf5b7eab588f615b";
  var pythonEvents = "https://api.meetup.com/2/events?offset=0&format=json&limited_events=False&group_urlname=oxfordpython&only=group%2Ctime%2Cevent_url%2Cname%2Cdescription%2Cyes_rsvp_count%2Crsvp_limit&photo-host=secure&page=1&fields=&order=time&status=upcoming&desc=false&sig_id=153356232&sig=1e612d144d798ea749c8d73d96455c234655329b";
  var doxford = "https://api.meetup.com/2/events?offset=0&format=json&limited_events=False&group_urlname=doxford&only=group%2Ctime%2Cevent_url%2Cname%2Cdescription%2Cyes_rsvp_count%2Crsvp_limit&photo-host=secure&page=1&fields=&order=time&status=upcoming&desc=false&sig_id=153356232&sig=2b28c2d54c7ae5451551c70f8d81f7f149b7e71f";
  var result;

  function phraseToUrl(phrase) {
    if (phrase.indexOf('js') >= 0) {
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
      return doxford;
    } else {
      return null;
    }
  }

  robot.hear(/(?:when|what)(?:s|'s| is) the next (.*)(?:meetup|event|talk|party|hack|shindig|gathering|meeting|happening)/i, function(msg) {
    var room = msg.message.room.toLowerCase();
    var community = msg.match[1].toLowerCase();
    var meetupURL = phraseToUrl(community) || phraseToUrl(room) || multipleEvents;

    console.log('Room: ' + room);
    console.log('Community: ' + community);
    console.log('MeetupURL: ' + meetupURL);

    robot.http(meetupURL).get()(function(err, res, body) {
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
  var eventTime = moment(event.time).tz('Europe/London');
  var eventName = event.name;
  var groupName = event.group.name;
  var time = eventTime.format('LT');
  var date = eventTime.format('LL');
  if (knownGroup) {
    return 'The next ' + groupName + ' meetup is "' + eventName + '" on the ' + date + ' at ' + time + '. More info: ' + eventUrl;
  } else {
    return 'The next meetup is by ' + groupName + ', "' + eventName + '" on the ' + date + ' at ' + time + '. More info: ' + eventUrl;
  }
}
