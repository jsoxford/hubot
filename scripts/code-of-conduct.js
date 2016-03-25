module.exports = function(robot) {
  var room = "test";

  robot.enter(function(msg) {
    console.log(msg.message.user.name + ' joined ' + msg.message.room);
    if(msg.message.room === room) {
        msg.send("Hi @" + msg.message.user.name + "! :wave: Please make sure you have read our Code of Conduct here: http://peterjwest.github.io/do-coc/");
        robot.send({room: msg.message.user.name}, "Hi @" + msg.message.user.name + "! :wave: Please make sure you have read our Code of Conduct here: http://peterjwest.github.io/do-coc/");
    }
  });
};
