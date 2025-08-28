const setupEl = document.getElementById("setup");
const punchlineEl = document.getElementById("punchline");
const loadBtn = document.getElementById("loadBtn");
const refreshBtn = document.getElementById("refreshBtn");
const copyBtn = document.getElementById("copyBtn");
const statusEl = document.getElementById("status");

const API_URL = "https://official-joke-api.appspot.com/random_joke";

function showStatus(msg, isError = false) {
  statusEl.textContent = msg;
  statusEl.style.color = isError ? "red" : "#6b7280";
}

function renderJoke(joke) {
  setupEl.textContent = joke.setup;
  punchlineEl.textContent = joke.punchline;
  refreshBtn.disabled = false;
  copyBtn.disabled = false;
}

async function fetchJoke() {
  showStatus("Loading...");
  loadBtn.disabled = true;
  refreshBtn.disabled = true;
  copyBtn.disabled = true;

  try {
    const res = await fetch(API_URL);
    if (!res.ok) throw new Error("Network response was not ok");

    const joke = await res.json();
    if (!joke.setup || !joke.punchline) throw new Error("Invalid joke format");

    renderJoke(joke);
    localStorage.setItem("lastJoke", JSON.stringify(joke));
    showStatus("Joke loaded successfully!");
  } catch (err) {
    showStatus("Error: " + err.message, true);
  } finally {
    loadBtn.disabled = false;
  }
}

function copyToClipboard() {
  const text = `${setupEl.textContent} - ${punchlineEl.textContent}`;
  navigator.clipboard.writeText(text).then(() => {
    showStatus("Copied to clipboard!");
  }).catch(() => {
    showStatus("Failed to copy!", true);
  });
}

// Load last cached joke if available
const cached = localStorage.getItem("lastJoke");
if (cached) {
  try {
    renderJoke(JSON.parse(cached));
  } catch { /* ignore bad cache */ }
}

// Event listeners
loadBtn.addEventListener("click", fetchJoke);
refreshBtn.addEventListener("click", fetchJoke);
copyBtn.addEventListener("click", copyToClipboard);
