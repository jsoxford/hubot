// You say potato, jsoxbot sends a potato

var potatoes = [
  "![potato](http://i1228.photobucket.com/albums/ee458/JediIvanova/Portal/work_7081785_1_sticker375x360_portal-2-because-im-a-potato-v1.png)",
  "![potato](http://imgfave-herokuapp-com.global.ssl.fastly.net/image_cache/1398085442355450.jpg)",
  "![potato](https://s-media-cache-ak0.pinimg.com/736x/1e/58/26/1e5826e0463d1dd3b0975c3fdb2ca233.jpg)",
  "![potato](http://funnyasduck.net/wp-content/uploads/2012/10/funny-ermahgerd-turtle-mash-pics.jpg)",
  "![potato](http://www.thefitedit.com/wp-content/uploads/2014/12/funny-potato-dancing-clipart1.jpg)",
  "![potato](https://s-media-cache-ak0.pinimg.com/736x/a6/5b/d3/a65bd31a582e1e39a18f793ebd077d61.jpg)",
  "![potato](https://s-media-cache-ak0.pinimg.com/736x/ca/b5/ee/cab5ee5a0ce32286cd42f8447ad7cd5e.jpg)",
  "![potato](http://scontent-a.cdninstagram.com/hphotos-xaf1/t51.2885-15/10693401_959685207392080_1171573745_n.jpg)",
  "![potato](https://media0.giphy.com/media/AxjfeKuEG4SK4/200_s.gif)",
  "![potato](https://s-media-cache-ak0.pinimg.com/736x/a8/c4/f9/a8c4f969f44026445b4f9b15b923aee7.jpg)",
  "![potato](http://40.media.tumblr.com/da674fef86658f9e3b8e556a2a739d5c/tumblr_nsqrgmYHch1tga488o1_500.png)",
  "![potato](https://33.media.tumblr.com/c1f2be2b2b6022384233f2776c37ab64/tumblr_nsw13cxgMF1urrsjuo1_500.gif)",
  "![potato](https://dl.dropboxusercontent.com/u/13316703/stuff/blackadder.jpg)",
  "potato"
];

function pickAPotato() {
  return potatoes[Math.floor(Math.random()*potatoes.length)];
}

module.exports = function(robot) {
  robot.hear(/potato/i, function(msg){
    msg.send(pickAPotato());
  });
};
