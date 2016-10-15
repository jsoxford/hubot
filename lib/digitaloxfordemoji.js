var emoji = {
  announce: [
    'all_the_things',
    'bmo',
    'bmo3',
    'celebrate',
    'dancing_corgi',
    'dancing_penguin',
    'dancing_robot',
    'excited',
    'good_job',
    'happygoat',
    'jake2',
    'lel',
    'llamadance',
    'loudspeaker',
    'parrot',
    'wavingarms',
    'woohoo',
    'xkcdwoo',
    'yay'
  ],
  sad: [
    'cry',
    'doh',
    'facepalm',
    'fb-sad',
    'llamasad',
    'sadpanda',
    'sadparrot',
    'smh',
    'sob',
    'tumbleweed2'
  ]
}

module.exports = function(keyword) {
  if (!emoji[keyword] || emoji[keyword].length === 0) return '';
  return `:${emoji[keyword][Math.floor(Math.random()*emoji[keyword].length)]}:`
}