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

module.exports = function(robot) {
  var multipleEvents = "https://api.meetup.com/2/events?offset=0&format=json&limited_events=False&group_id=1722581%2C17778422%2C19558444%2C12345482%2C18829161%2C18789928%2C18617250&only=time%2Cevent_url%2Cname%2Cdescription%2Cyes_rsvp_count%2Crsvp_limit&photo-host=secure&page=20&fields=&order=time&status=upcoming&desc=false&sig_id=153356042&sig=c7505d57af956b61e6ede8e6faddfd0398086a55";
  var jsOxfordEvents = "https://api.meetup.com/2/events?offset=0&format=json&limited_events=False&group_id=17778422&only=time%2Cevent_url%2Cname%2Cdescription%2Cyes_rsvp_count%2Crsvp_limit&photo-host=secure&page=20&fields=&order=time&desc=false&status=upcoming&sig_id=153356042&sig=84e9ac6ce37bdb3c00e4f82fe5a7ce798865fbe4";
  var uxOxfordEvents = "https://api.meetup.com/2/events?offset=0&format=json&limited_events=False&group_urlname=UX-Oxford&only=time%2Cevent_url%2Cname%2Cdescription%2Cyes_rsvp_count%2Crsvp_limit&photo-host=secure&page=20&fields=&order=time&status=upcoming&desc=false&sig_id=153356042&sig=04a4edfbcbab17f591a8ad208da4b02bf364e24c";
  var phpOxfordEvents = "https://api.meetup.com/2/events?offset=0&format=json&limited_events=False&group_urlname=PHP-Oxford&only=time%2Cevent_url%2Cname%2Cdescription%2Cyes_rsvp_count%2Crsvp_limit&photo-host=public&page=20&fields=&order=time&status=upcoming&desc=false&sig_id=153356042&sig=2893753701aa73225565fc154a447ced1d0b20bb";
  var dockerEvents = "https://api.meetup.com/2/events?offset=0&format=json&limited_events=False&group_urlname=docker-oxford&only=time%2Cevent_url%2Cname%2Cdescription%2Cyes_rsvp_count%2Crsvp_limit&photo-host=public&page=20&fields=&order=time&status=upcoming&desc=false&sig_id=153356042&sig=691ed0980f6543572bb425f7d1675e911e592553";
  var rubyEvents = "https://api.meetup.com/2/events?offset=0&format=json&limited_events=False&group_urlname=Oxford-Ruby-Users-Group-OxRUG&only=time%2Cevent_url%2Cname%2Cdescription%2Cyes_rsvp_count%2Crsvp_limit&photo-host=public&page=20&fields=&order=time&status=upcoming&desc=false&sig_id=153356042&sig=28283c85246a091d9cc0dff99aac1c1bbd2941a5";
  var pythonEvents = "https://api.meetup.com/2/events?offset=0&format=json&limited_events=False&group_urlname=oxfordpython&only=time%2Cevent_url%2Cname%2Cdescription%2Cyes_rsvp_count%2Crsvp_limit&photo-host=secure&page=20&fields=&order=time&status=upcoming&desc=false&sig_id=153356042&sig=f2b06efd17bf9cafe4a6e82f35ea0a28639d06f2";
  var doxford = "https://api.meetup.com/2/events?offset=0&format=json&limited_events=False&group_urlname=doxford&only=time%2Cevent_url%2Cname%2Cdescription%2Cyes_rsvp_count%2Crsvp_limit&photo-host=secure&page=20&fields=&order=time&status=upcoming&desc=false&sig_id=153356042&sig=bcf08dbdc0a70403f873540f11c2dbeb60ea1fc7";
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
        msg.send(result[0].event_url);
      } else {
        msg.send("No upcoming events planned");
      }
    });

  });
}
