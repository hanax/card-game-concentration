import 'normalize-css';
import '../styles/index.styl';
import Game from './classes/Game';

$(() => {
  const game = new Game();

  $('#column-start').on('click', () => {
    try {
      if (!game.isPlaying()
        || window.confirm('Are you sure? All progress will not be saved.')
      ) {
        const boardSize = $('#select__board-size').val();
        game.start(boardSize);
      }
    } catch(e) {
      console.log(e);
    }
  });

  $('#column-how').on('click', () => {
    window.alert('Concentration, also known as memory match or pairs, is a card game in which you lay all the card face down on a surface and on each turn flip over two at a time. The goal of the game is to find all matching pairs of cards.');
  });

  $('#column-hint').on('click', () => {
    game.showHint();
  });
});
