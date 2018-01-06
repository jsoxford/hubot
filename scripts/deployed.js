// Lets you know when it's been deployed. Useful for debugging
module.exports = function(robot) {
  robot.messageRoom('robot', 'I have just been deployed');
};
