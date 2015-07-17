// You say potato, jsoxbot says potato

module.exports = function(robot) {
  robot.hear(/potato/i, function(msg){
    msg.send("potato");
  });
};
