import {generateIconIndexes, setCheckboxes, getCheckboxes} from '../utils/utils';
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
    this.score = 0;

    this.timer = setInterval(() => {
      this.timeLeft --;
    }, 1000);

    this.renderBoard(boardSize);
  };

  renderBoard(boardSize = 4) {
    const iconIndexes = generateIconIndexes(boardSize, TOTAL_ICON_PAIRS);
    const $board = $('.board').empty().show();

    for (let i = 0; i < boardSize; i ++) {
      const $row = $('<div class=\'board__row\'/>').appendTo($board);
      for (let j = 0; j < boardSize; j ++) {
        const idx = i * boardSize + j;
        $row
          .append(`<input type='checkbox' id='checkbox-${idx}' value='${iconIndexes[idx]}'>`)
          .append(`<label class='board__column' for='checkbox-${idx}'>
            <div class='board__column-wrapper'>
              <span class='flaticon-animal-${iconIndexes[idx]}' />
            </div>
          </label>`);
      }
    }

    getCheckboxes($board).change(() => {
      let nextScore = this.score;
      const $checked = getCheckboxes($board, 'checked');
      if ($checked.length > 1) {
        if ($checked[0].value === $checked[1].value) {
          setTimeout(() => {
            setCheckboxes($checked, {disabled: true});
            if (getCheckboxes($board, 'disabled').length === boardSize * boardSize) {
              this.end();
            }
          }, 500);
          nextScore += 10;
        } else {
          nextScore -= 1;
        }
        this.score = nextScore;
        setTimeout(() => {
          setCheckboxes($checked, {checked: false});
        }, 500);
      }
    });

    // flash the board at the beginning
    setCheckboxes(getCheckboxes($board), {disabled: true});
    window.setTimeout(() => {
      setCheckboxes(getCheckboxes($board), {disabled: false});
    }, 1000 * INITIAL_FLASH_TIME[boardSize]);
  };
}
