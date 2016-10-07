var marked = require('marked');

var footers = [
  marked('Credits: [Font Awesome](http://fontawesome.io/), [flaticon](http://www.flaticon.com), [Subtle Patterns](http://http://subtlepatterns.com/)'),
  marked('Made with <span class = \'fa fa-heart\'></span> by [Hannah](http://hanax.co)')
];

var board_sizes = [4, 6, 8, 10];

module.exports = {
  footers: footers,
  board_sizes: board_sizes,
};
