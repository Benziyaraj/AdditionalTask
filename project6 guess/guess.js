(() => {
  const guessInput = document.getElementById('guessInput');
  const guessBtn = document.getElementById('guessBtn');
  const resetBtn = document.getElementById('resetBtn');
  const statusEl = document.getElementById('status');
  const attemptsEl = document.getElementById('attempts');
  const historyEl = document.getElementById('history');
  const inputError = document.getElementById('inputError');
  const bestScoreEl = document.getElementById('bestScore');

  let secret, attemptsLeft, history, gameOver, bestScore;

  function init() {
    secret = Math.floor(Math.random() * 100) + 1;
    attemptsLeft = 10;
    history = [];
    gameOver = false;
    statusEl.textContent = '';
    statusEl.className = 'status';
    attemptsEl.textContent = `Attempts remaining: ${attemptsLeft}`;
    historyEl.innerHTML = '';
    inputError.textContent = '';
    guessInput.value = '';
    guessInput.disabled = false;
    guessBtn.disabled = true;
    updateBestScore();
    console.log('Secret:', secret); // For testing only
  }

  function updateBestScore() {
    bestScore = localStorage.getItem('bestScore');
    bestScoreEl.textContent = bestScore ? bestScore : '–';
  }

  function validateInput() {
    const value = guessInput.value.trim();
    if (!value) {
      inputError.textContent = '';
      guessBtn.disabled = true;
      return null;
    }
    const num = Number(value);
    if (Number.isNaN(num) || num < 1 || num > 100) {
      inputError.textContent = 'Enter a number between 1 and 100.';
      guessBtn.disabled = true;
      return null;
    }
    inputError.textContent = '';
    guessBtn.disabled = false;
    return num;
  }

  function addHistory(guess) {
    history.push(guess);
    const li = document.createElement('li');
    li.textContent = guess;
    historyEl.appendChild(li);
  }

  function showStatus(msg, type) {
    statusEl.textContent = msg;
    statusEl.className = `status animate ${type || ''}`;
  }

  function handleGuess() {
    if (gameOver) return;
    const num = validateInput();
    if (num === null) return;

    addHistory(num);
    attemptsLeft--;
    attemptsEl.textContent = `Attempts remaining: ${attemptsLeft}`;

    if (num === secret) {
      showStatus(`Correct! The number was ${secret}.`, 'success');
      gameOver = true;
      guessInput.disabled = true;
      guessBtn.disabled = true;
      const used = 10 - attemptsLeft;
      if (!bestScore || used < bestScore) {
        localStorage.setItem('bestScore', used);
        updateBestScore();
      }
    } else if (num < secret) {
      showStatus('Too low!', 'error');
    } else {
      showStatus('Too high!', 'error');
    }

    if (attemptsLeft === 0 && !gameOver) {
      showStatus(`Game over! The number was ${secret}.`, 'error');
      gameOver = true;
      guessInput.disabled = true;
      guessBtn.disabled = true;
    }

    guessInput.value = '';
    guessBtn.disabled = true;
    guessInput.focus();
  }

  // Events
  guessInput.addEventListener('input', validateInput);
  guessBtn.addEventListener('click', handleGuess);
  resetBtn.addEventListener('click', init);
  guessInput.addEventListener('keyup', e => {
    if (e.key === 'Enter' && !guessBtn.disabled) {
      handleGuess();
    }
  });

  // Init
  init();
})();
