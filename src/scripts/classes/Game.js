import {generateIconIndexes, setCheckboxes} from '../utils/utils';
import {TOTAL_ICON_PAIRS, INITIAL_FLASH_TIME, TIME_LEFT} from '../constants/constants';

export default class Game {
  constructor() {
    this.timer = null;
    this.score = 0;
    this.timeLeft = 0;
  }

  get timeLeft() {
    return parseInt($('#row-timer').text(), 10);
  }

  get score() {
    return parseInt($('#row-score').text(), 10);
  }

  set timeLeft(timeLeft) {
    $('#row-timer')
      .removeClass('text--highlight')
      .text(timeLeft);
    if (timeLeft === 0) {
      this.timer = null;
    }
    if (timeLeft <= 10 && this.timer) {
      $('#row-timer').addClass('text--highlight');
    }
    if (timeLeft <= 0) {
      this.end();
    }
  }

  set score(score) {
    $('#row-score').text(score);
  }

  set timer(timer) {
    if (timer === null && this._timer !== null) {
      clearInterval(this._timer);
    }
    this._timer = timer;
  }

  isTouched() {
    return this._timer !== null;
  }

  end() {
    setCheckboxes($(".board input"), {disabled: true});

    // Add the time left as bonus score
    const calScoreTimer = setInterval(() => {
      if (this.timeLeft <= 0) {
        clearInterval(calScoreTimer);
        const topScore =
          Math.max(this.score, window.localStorage.getItem('concentrationTopScore') || 0);
        $('#row-top-score').text(topScore);
        window.localStorage.setItem('concentrationTopScore', topScore);
      } else {
        this.score += 2;
        this.timeLeft --;
      }
    }, 50);
  }

  start(boardSize) {
    this.timeLeft = TIME_LEFT[boardSize];

    this.timer = setInterval(() => {
      this.timeLeft --;
    }, 1000);

    renderBoard(boardSize, this);
  };
}

const renderBoard = (boardSize = 4, game) => {
  const iconIndexes = generateIconIndexes(boardSize, TOTAL_ICON_PAIRS);
  const $board = $('.board').empty().show();

  for (let i = 0; i < boardSize; i ++) {
    const $row = $('<div class=\'board__row\'/>')
      .appendTo($board);

    for (let j = 0; j < boardSize; j ++) {
      const idx = i * boardSize + j;
      $row
        .append(`<input type='checkbox' id='checkbox-${idx}' value='${iconIndexes[idx]}'>`)
        .append(`<label class='board__column' for='checkbox-${idx}'>
          <div class='board__column-wrapper'>
            <span class='flaticon-animal-${iconIndexes[idx]}' />
          </div>
        </label>`);

      $(`#checkbox-${idx}`).change(() => {
        let nextScore = game.score;
        const $cur = $(`#checkbox-${idx}`);
        const $checked = $('.board input:checked');
        if ($checked.length > 1) {
          const inputA = $checked[0];
          const inputB = $checked[1];
          if (inputA.value === inputB.value) {
            setTimeout(() => {
              setCheckboxes($([inputA, inputB]), {disabled: true});
              if ($('.board input:disabled').length === boardSize * boardSize) {
                game.end();
              }
            }, 500);
            nextScore += 10;
          } else {
            nextScore -= 1;
          }
          game.score = nextScore;
          setTimeout(() => {
            setCheckboxes($([inputA, inputB]), {checked: false});
          }, 500);
        }
      });
    }
  }

  // flash the board at the beginning
  setCheckboxes($(".board input"), {disabled: true});
  window.setTimeout(() => {
    setCheckboxes($(".board input"), {disabled: false});
  }, 1000 * INITIAL_FLASH_TIME[boardSize]);
};
