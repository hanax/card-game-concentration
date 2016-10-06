// TODO: check browser for compatibility
// TODO: give hint, random swap
// TODO: add timer for initial flash
// TODO: animations: score change

import 'normalize-css';
import '../styles/index.styl';
import Game from './classes/Game';

$(() => {
  const game = new Game();

  $('#row-start').on('click', () => {
    try {
      if (!game.isTouched()
        || window.confirm('Are you sure? All progress will not be saved.')
      ) {
        const boardSize = $('#select__board-size').val();
        game.start(boardSize);
      }
    } catch(e) {
      console.log(e);
    }
  })
});
