(() => {
  // ---------------- CLOCK ----------------
  const clockEl = document.getElementById('clock');
  const startBtn = document.getElementById('startClock');
  const stopBtn = document.getElementById('stopClock');
  const toggleBtn = document.getElementById('toggleFormat');

  let clockInterval = null;
  let is24h = true;

  function formatTime(date) {
    let h = date.getHours();
    let m = String(date.getMinutes()).padStart(2, '0');
    let s = String(date.getSeconds()).padStart(2, '0');
    let suffix = '';

    if (!is24h) {
      suffix = h >= 12 ? ' PM' : ' AM';
      h = h % 12 || 12;
    }
    return `${String(h).padStart(2, '0')}:${m}:${s}${suffix}`;
  }

  function updateClock() {
    const now = new Date();
    clockEl.textContent = formatTime(now);
    clockEl.classList.remove('animate-tick');
    void clockEl.offsetWidth; // restart animation
    clockEl.classList.add('animate-tick');
  }

  function startClock() {
    if (clockInterval) return; // prevent double intervals
    updateClock();
    clockInterval = setInterval(updateClock, 1000);
  }

  function stopClock() {
    clearInterval(clockInterval);
    clockInterval = null;
  }

  toggleBtn.addEventListener('click', () => {
    is24h = !is24h;
    toggleBtn.textContent = is24h ? 'Switch to 12h' : 'Switch to 24h';
    updateClock();
  });

  startBtn.addEventListener('click', startClock);
  stopBtn.addEventListener('click', stopClock);

  // auto-start
  startClock();

  // ---------------- TIMER ----------------
  const minInput = document.getElementById('minutes');
  const secInput = document.getElementById('seconds');
  const timerDisplay = document.getElementById('timerDisplay');
  const startTimerBtn = document.getElementById('startTimer');
  const stopTimerBtn = document.getElementById('stopTimer');
  const resetTimerBtn = document.getElementById('resetTimer');
  const beep = document.getElementById('beep');

  let timerInterval = null;
  let timerRemaining = 0;

  function formatMMSS(totalSeconds) {
    const m = Math.floor(totalSeconds / 60);
    const s = totalSeconds % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  }

  function updateTimerDisplay() {
    timerDisplay.textContent = formatMMSS(timerRemaining);
    timerDisplay.classList.remove('animate-tick');
    void timerDisplay.offsetWidth;
    timerDisplay.classList.add('animate-tick');
  }

  function startTimer() {
    if (timerInterval) return;
    const mins = parseInt(minInput.value, 10) || 0;
    const secs = parseInt(secInput.value, 10) || 0;
    timerRemaining = mins * 60 + secs;
    if (timerRemaining <= 0) return;
    updateTimerDisplay();

    timerInterval = setInterval(() => {
      timerRemaining--;
      updateTimerDisplay();
      if (timerRemaining <= 0) {
        clearInterval(timerInterval);
        timerInterval = null;
        beep.play();
      }
    }, 1000);
  }

  function stopTimer() {
    clearInterval(timerInterval);
    timerInterval = null;
  }

  function resetTimer() {
    stopTimer();
    const mins = parseInt(minInput.value, 10) || 0;
    const secs = parseInt(secInput.value, 10) || 0;
    timerRemaining = mins * 60 + secs;
    updateTimerDisplay();
  }

  startTimerBtn.addEventListener('click', startTimer);
  stopTimerBtn.addEventListener('click', stopTimer);
  resetTimerBtn.addEventListener('click', resetTimer);

  // init timer display
  resetTimer();
})();
