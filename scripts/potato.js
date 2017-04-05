// You say potato, jsoxbot sends a potato

var potatoes = [
  "http://i1228.photobucket.com/albums/ee458/JediIvanova/Portal/work_7081785_1_sticker375x360_portal-2-because-im-a-potato-v1.png",
  "https://s-media-cache-ak0.pinimg.com/originals/9c/6a/62/9c6a62660ab178c7f12db9833ad13c53.jpg",
  "https://s-media-cache-ak0.pinimg.com/736x/1e/58/26/1e5826e0463d1dd3b0975c3fdb2ca233.jpg",
  "http://funnyasduck.net/wp-content/uploads/2012/10/funny-ermahgerd-turtle-mash-pics.jpg",
  "https://yscpoetry.files.wordpress.com/2015/10/funny-potato-dancing-clipart1.jpg",
  "https://s-media-cache-ak0.pinimg.com/736x/a6/5b/d3/a65bd31a582e1e39a18f793ebd077d61.jpg",
  "https://s-media-cache-ak0.pinimg.com/736x/ca/b5/ee/cab5ee5a0ce32286cd42f8447ad7cd5e.jpg",
  "http://scontent-a.cdninstagram.com/hphotos-xaf1/t51.2885-15/10693401_959685207392080_1171573745_n.jpg",
  "https://media0.giphy.com/media/AxjfeKuEG4SK4/200_s.gif",
  "https://s-media-cache-ak0.pinimg.com/736x/a8/c4/f9/a8c4f969f44026445b4f9b15b923aee7.jpg",
  "http://40.media.tumblr.com/da674fef86658f9e3b8e556a2a739d5c/tumblr_nsqrgmYHch1tga488o1_500.png",
  "http://3.bp.blogspot.com/-6-2vWxQUbEw/VGrdBkoQ1oI/AAAAAAAAAa8/YHFKpWOthhA/s1600/LOL%2BPOTATO.gif",
  "http://i.imgur.com/z3xJHRz.jpg",
  "http://www.vitamin-ha.com/wp-content/uploads/2012/12/Vh-150307706283444698_6PqcTpmD_c.jpg",
  "http://wanna-joke.com/wp-content/uploads/2015/04/funny-book-potato-influence.jpg",
  ":potato:"
];

function pickAPotato() {
  return potatoes[Math.floor(Math.random()*potatoes.length)];
}

module.exports = function(robot) {
  robot.hear(/potato/i, function(msg){
    msg.send(pickAPotato());
  });
};
