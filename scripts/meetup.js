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
  var multipleEvents = "https://api.meetup.com/2/events?offset=0&format=json&limited_events=False&group_id=17778422%2C12345482%2C18829161%2C18789928%2C18617250%2C1722581&only=time%2Cevent_url%2Cname%2Cdescription%2Cyes_rsvp_count%2Crsvp_limit&photo-host=secure&page=20&fields=&order=time&status=upcoming&desc=false&sig_id=153356232&sig=27901c155b8c0bb865805e39a904c41ee23f8a90";
  var jsOxfordEvents = "https://api.meetup.com/2/events?offset=0&format=json&limited_events=False&group_id=17778422&only=time%2Cevent_url%2Cname%2Cdescription%2Cyes_rsvp_count%2Crsvp_limit&photo-host=secure&page=20&fields=&order=time&desc=false&status=upcoming&sig_id=153356042&sig=84e9ac6ce37bdb3c00e4f82fe5a7ce798865fbe4";
  var uxOxfordEvents = "https://api.meetup.com/2/events?offset=0&format=json&limited_events=False&group_urlname=UX-Oxford&only=time%2Cevent_url%2Cname%2Cdescription%2Cyes_rsvp_count%2Crsvp_limit&photo-host=secure&page=20&fields=&order=time&status=upcoming&desc=false&sig_id=153356042&sig=04a4edfbcbab17f591a8ad208da4b02bf364e24c";
  var phpOxfordEvents = "https://api.meetup.com/2/events?offset=0&format=json&limited_events=False&group_urlname=PHP-Oxford&only=time%2Cevent_url%2Cname%2Cdescription%2Cyes_rsvp_count%2Crsvp_limit&photo-host=public&page=20&fields=&order=time&status=upcoming&desc=false&sig_id=153356042&sig=2893753701aa73225565fc154a447ced1d0b20bb";
  var dockerEvents = "https://api.meetup.com/2/events?offset=0&format=json&limited_events=False&group_urlname=docker-oxford&only=time%2Cevent_url%2Cname%2Cdescription%2Cyes_rsvp_count%2Crsvp_limit&photo-host=public&page=20&fields=&order=time&status=upcoming&desc=false&sig_id=153356042&sig=691ed0980f6543572bb425f7d1675e911e592553";
  var rubyEvents = "https://api.meetup.com/2/events?offset=0&format=json&limited_events=False&group_urlname=Oxford-Ruby-Users-Group-OxRUG&only=time%2Cevent_url%2Cname%2Cdescription%2Cyes_rsvp_count%2Crsvp_limit&photo-host=public&page=20&fields=&order=time&status=upcoming&desc=false&sig_id=153356042&sig=28283c85246a091d9cc0dff99aac1c1bbd2941a5";
  var pythonEvents = "https://api.meetup.com/2/events?offset=0&format=json&limited_events=False&group_urlname=oxfordpython&only=time%2Cevent_url%2Cname%2Cdescription%2Cyes_rsvp_count%2Crsvp_limit&photo-host=secure&page=20&fields=&order=time&status=upcoming&desc=false&sig_id=153356042&sig=f2b06efd17bf9cafe4a6e82f35ea0a28639d06f2";
  var result;

  robot.hear(/(?:when|what)(?:s|'s| is) the next (\w*)\s?(?:meet|event|talk|party|hack|shindig|gathering)/i, function(msg){
    var room = msg.message.room;
    var community = msg.match[1].toLowerCase();
    var meetupURL = multipleEvents;

    console.log('Room: ' + room);
    console.log('Community: ' + community);
    console.log('MeetupURL: ' + meetupURL);

    if (community.length === 0) {
      community = room;
    }

    if(community.indexOf('js') >= 0) {
      meetupURL = jsOxfordEvents;
    } else if(community.indexOf('ux') >= 0) {
      meetupURL = uxOxfordEvents;
    } else if(community.indexOf('php') >= 0) {
      meetupURL = phpOxfordEvents;
    } else if(community.indexOf('docker') >= 0) {
      meetupURL = dockerEvents;
    } else if(community.indexOf('ruby') >= 0 || community.indexOf('rb') >= 0) {
      meetupURL = rubyEvents;
    } else if(community.indexOf('py') >= 0) {
      meetupURL = pythonEvents;
    }

    robot.http(meetupURL).get()(function(err, res, body){
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
