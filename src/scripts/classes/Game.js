import {generateIconIndexes, setInputs, getInputs} from '../utils/utils';
import {TOTAL_ICON_PAIRS, INITIAL_FLASH_TIME, TIME_LEFT, DEFAULT_BOARD_SIZE, N_HINT} from '../constants/constants';

export default class Game {
  constructor() {
    this.timer = null;
    this.score = 0;
    this.totTime = 0;
    this.timeLeft = 0;
    this.boardSize = DEFAULT_BOARD_SIZE;
    this.hintsLeft = 0;
  }

  get hintsLeft() {
    return this._hintsLeft;
  }

  set hintsLeft(hintsLeft) {
    this._hintsLeft = hintsLeft;

    // Update background indicator for number of hints left
    const $columnHint =
      $('button#column-hint')
      .css(
        'boxShadow',
        `inset 0 -${2 + 60 * (1 - this.hintsLeft / N_HINT[this.boardSize])}px 0 rgba(0,0,0,.1)`
      );

    setInputs($columnHint, {disabled: hintsLeft === 0});
  }

  get timeLeft() {
    return this._timeLeft;
  }

  set timeLeft(timeLeft) {
    this._timeLeft = Math.max(0, Math.min(this.totTime, timeLeft));

    if (this.timeLeft === 0) {
      this.end();
    }

    // Update displayed left time
    const initialFlashTime = INITIAL_FLASH_TIME[this.boardSize] - this.totTime + this.timeLeft;
    $('#row-timer').text(initialFlashTime > 0 && !this.isPlaying()
      ? `Feel the cats! ${initialFlashTime}`
      : this.timeLeft);

    // Update background indicator for time left
    const $rowTimer = $('.row-timer')
      .removeClass('animated-highlight')
      .css('width', (this.timeLeft / this.totTime) * 100 + '%');
    if (this.timeLeft <= 10 && this.timer) {
      setTimeout(() => { $rowTimer.addClass('animated-highlight') }, 10);
    }
  }

  get score() {
    return parseInt($('#row-score').text(), 10);
  }

  set score(score) {
    // Animate displayed score if it goes up
    const prevScore = this.score;
    const $rowScore = $('#row-score')
      .removeClass('animated-up')
      .text(Math.max(0, score));
    if (this.score > prevScore) {
      setTimeout(() => { $rowScore.addClass('animated-up') }, 10);
    }

    // Update top score board
    const topScore = Math.max(
      this.score,
      window.localStorage.getItem('concentrationTopScore') || 0
    );
    $('#row-top-score').text(topScore);
    window.localStorage.setItem('concentrationTopScore', topScore);
  }

  get timer() {
    return this._timer;
  }

  set timer(timer) {
    if (this._timer !== null) {
      clearInterval(this._timer);
    }
    this._timer = timer;
  }

  isPlaying() {
    return this.timer !== null
      && getInputs($('.board'), 'disabled').length !== this.boardSize * this.boardSize;
  }

  showHint() {
    this.hintsLeft --;

    // Find a pair to reveal
    const $enabled = getInputs($('.board'), 'enabled');
    const enabledValues = $.makeArray($enabled.map((i, obj) => obj.value));
    const possiblePair = [$enabled[0], $enabled[enabledValues.lastIndexOf(enabledValues[0])]];

    setInputs($(possiblePair), {disabled: true});
  }

  end() {
    setInputs(getInputs($('.board')), {disabled: true});
    this.timer = null;

    // Add left time as bonus score
    const calScoreTimer = setInterval(() => {
      if (this.timeLeft === 0) {
        clearInterval(calScoreTimer);
      } else {
        this.score += 2;
        this.timeLeft --;
      }
    }, 50);
  }

  start(boardSize) {
    this.boardSize = boardSize;
    this.totTime = TIME_LEFT[boardSize];
    this.timeLeft = this.totTime;
    this.hintsLeft = 0;
    this.score = 0;

    this.renderBoard();
    this.timer = setInterval(() => {
      this.timeLeft --;
    }, 1000);
  };

  renderBoard() {
    const iconIndexes = generateIconIndexes(this.boardSize, TOTAL_ICON_PAIRS);
    const $board = $('.board').empty().show();

    for (let i = 0; i < this.boardSize; i ++) {
      const $row = $('<div class=\'board__row\'/>').appendTo($board);
      for (let j = 0; j < this.boardSize; j ++) {
        const idx = i * this.boardSize + j;
        $row
          .append(`
            <input type='checkbox' id='checkbox-${idx}' value='${iconIndexes[idx]}'>
            <label class='board__column' for='checkbox-${idx}'>
              <div class='board__column-wrapper'>
                <span class='flaticon-animal-${iconIndexes[idx]}' />
              </div>
            </label>
          `);
      }
    }

    getInputs($board).change(() => {
      const $checked = getInputs($board, 'checked');
      if ($checked.length === 2) {
        if ($checked[0].value === $checked[1].value) {
          // Succeed to pair
          setTimeout(() => {
            setInputs($checked, {disabled: true});
            if (getInputs($board, 'disabled').length === this.boardSize * this.boardSize) {
              this.end();
            }
          }, 500);
          this.timeLeft += 5;
          this.score += 10;
        } else {
          // Fail to pair
          this.score -= 1;
        }
        setTimeout(() => { setInputs($checked, {checked: false}); }, 500);
      }
    });

    // Show the board briefly at the beginning
    setInputs(getInputs($board), {disabled: true});
    window.setTimeout(() => {
      setInputs(getInputs($board), {disabled: false});
      this.hintsLeft = N_HINT[this.boardSize];
    }, 1000 * INITIAL_FLASH_TIME[this.boardSize]);
  };
}
