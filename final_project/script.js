// ------------------ Shared Data ------------------

const SENTENCES = [
  "The quick brown fox jumps over the lazy dog.",
  "Practice every day and your typing will improve.",
  "Speed matters only when accuracy is under control.",
  "Small consistent steps lead to big changes over time.",
  "Typing tests are a fun way to build keyboard confidence.",
  "Focus on staying calm and relaxed while typing quickly."
];

const WORDS = [
  "time", "code", "green", "river", "cloud", "light", "keyboard", "track",
  "mouse", "paper", "silent", "early", "night", "calm", "focus", "speed",
  "sharp", "metal", "apple", "yellow", "music", "sound", "logic", "array",
  "object", "window", "screen", "future", "random", "typing", "practice",
  "daily", "habit", "stone", "fire", "snow", "sun", "forest", "dream"
];

const STORAGE_KEYS = {
  THEME: "typingTheme",
  BEST_WPM: "typingBestWpm",
  BEST_ACCURACY: "typingBestAccuracy",
  TOTAL_TESTS: "typingTotalTests"
};

// ------------------ Helper ------------------

function $(selector) {
  return document.querySelector(selector);
}

function setYear() {
  const yearSpan = $("#year");
  if (yearSpan) {
    yearSpan.textContent = new Date().getFullYear();
  }
}

// theme
function applyTheme(theme) {
  const body = document.body;
  body.classList.remove("theme-light", "theme-dark", "theme-dracula");
  if (theme === "dark") body.classList.add("theme-dark");
  else if (theme === "dracula") body.classList.add("theme-dracula");
  else body.classList.add("theme-light");
}

function initThemeSelector() {
  const select = $("#theme-select");
  const saved = localStorage.getItem(STORAGE_KEYS.THEME) || "light";
  applyTheme(saved);
  if (select) {
    select.value = saved;
    select.addEventListener("change", () => {
      const val = select.value;
      applyTheme(val);
      localStorage.setItem(STORAGE_KEYS.THEME, val);
    });
  }
}

// ------------------ Typing Test (index.html) ------------------

document.addEventListener("DOMContentLoaded", () => {
  setYear();
  initThemeSelector();
  initFAQ();
  initLeaderboardPage();
  initTypingPage();
});

let timerId = null;

function initTypingPage() {
  // only run on index.html
  const display = $("#text-display");
  const hiddenInput = $("#hidden-input");
  const startBtn = $("#start-btn");
  if (!display || !hiddenInput || !startBtn) return;

  const timeSelect = $("#time-select");
  const modeSelect = $("#mode-select");
  const restartBtn = $("#restart-btn");

  const timeDisplay = $("#time-display");
  const wpmLiveEl = $("#wpm-live");
  const rawWpmLiveEl = $("#raw-wpm-live");
  const accLiveEl = $("#accuracy-live");

  const resultsPanel = $("#results-panel");
  const wpmFinalEl = $("#wpm-final");
  const rawWpmFinalEl = $("#raw-wpm-final");
  const accFinalEl = $("#accuracy-final");
  const charsFinalEl = $("#chars-final");
  const errorsFinalEl = $("#errors-final");
  const resultMsgEl = $("#result-message");

  let timeLeft = 0;
  let totalTime = 0;

  let currentText = "";
  let currentWords = [];
  let activeWordIndex = 0;
  let typedChars = 0;
  let correctChars = 0;
  let errorCount = 0;
  let testRunning = false;
  let readyToStart = false;
  let timerStarted = false;

  function generateParagraph() {
    const count = 3 + Math.floor(Math.random() * 3); // 3–5 sentences
    const parts = [];
    for (let i = 0; i < count; i++) {
      const s = SENTENCES[Math.floor(Math.random() * SENTENCES.length)];
      parts.push(s);
    }
    return parts.join(" ");
}


  function generateWordLine(count) {
    const pool = [...WORDS];
    const result = [];

    for (let i = 0; i < count; i++) {
      if (pool.length === 0) break;

      const idx = Math.floor(Math.random() * pool.length);
      result.push(pool[idx]);
      pool.splice(idx, 1);
    }

    return result.join(" ");
  }

  function renderText(text) {
    display.innerHTML = "";
    currentWords = text.split(" ");
    currentWords.forEach((word, wordIdx) => {
      const wordSpan = document.createElement("span");
      wordSpan.classList.add("word");
      if (wordIdx === 0) wordSpan.classList.add("active");

      [...word].forEach((ch) => {
        const chSpan = document.createElement("span");
        chSpan.textContent = ch;
        chSpan.classList.add("char");
        wordSpan.appendChild(chSpan);
      });

      display.appendChild(wordSpan);
      display.append(" ");
    });
    insertCaret(0, 0);
  }

  function insertCaret(wordIndex, charIndex) {
    // remove existing caret
    display.querySelectorAll(".caret").forEach((c) => c.remove());
    const wordSpans = display.querySelectorAll(".word");
    if (wordIndex >= wordSpans.length) {
      const lastWord = wordSpans[wordSpans.length - 1];
      lastWord && lastWord.appendChild(makeCaretSpan());
      return;
    }
    const wordSpan = wordSpans[wordIndex];
    const chars = wordSpan.querySelectorAll(".char");
    const caret = makeCaretSpan();
    if (charIndex >= chars.length) {
      wordSpan.appendChild(caret);
    } else {
      wordSpan.insertBefore(caret, chars[charIndex]);
    }
  }

  function makeCaretSpan() {
    const caret = document.createElement("span");
    caret.classList.add("caret");
    return caret;
  }

  function resetState() {
    activeWordIndex = 0;
    typedChars = 0;
    correctChars = 0;
    errorCount = 0;
    wpmLiveEl.textContent = "0";
    rawWpmLiveEl.textContent = "0";
    accLiveEl.textContent = "0";
    timeDisplay.textContent = "0";
  }

  function startTest() {
    if (testRunning) return;

      resetState();

      const mode = modeSelect.value;
      if (mode === "sentences") {
        currentText = generateParagraph();
      } else {
        currentText = generateWordLine(50);
      }

      renderText(currentText);

      totalTime = parseInt(timeSelect.value, 10) || 30;
      timeLeft = totalTime;
      timeDisplay.textContent = timeLeft.toString();

      hiddenInput.disabled = false;
      hiddenInput.value = "";
      hiddenInput.focus();

      resultsPanel.classList.add("hidden");

      // let typing begin but DON'T start timer yet
      testRunning = false;  
      startBtn.disabled = true;
      restartBtn.disabled = false;

      readyToStart = true;
  }

  function restartTest() {
    if (timerId) {
        clearInterval(timerId);
        timerId = null;
    }

    testRunning = false;
    timerStarted = false;
    readyToStart = false;

    hiddenInput.disabled = true;
    hiddenInput.value = "";
    display.innerHTML = "";
    
    resetState();
    resultsPanel.classList.add("hidden");

    startBtn.disabled = false;
    restartBtn.disabled = true;

    timeDisplay.textContent = timeSelect.value;;
  }

  function handleInput() {
    if (hiddenInput.value.length === 0 && !timerStarted) {
    return;
    }
    // Start timer only after first keystroke
    if (readyToStart && !timerStarted) {
        timerStarted = true;
        readyToStart = false;
        testRunning = true;

        if (timerId) clearInterval(timerId);
        timerId = setInterval(() => {
          timeLeft--;
          timeDisplay.textContent = timeLeft.toString();
          if (timeLeft <= 0) finishTest();
        }, 1000);
    }


    if (!testRunning) return;
    const typed = hiddenInput.value;
    typedChars = typed.length;

    const wordsTyped = typed.split(" ");
    activeWordIndex = Math.max(0, wordsTyped.length - 1);

    const wordSpans = display.querySelectorAll(".word");
    wordSpans.forEach((w) => {
      w.classList.remove("active", "done-correct", "done-error");
    });

    if (activeWordIndex >= currentWords.length) {
    finishTest();
    return;
  }

    // evaluate each completed word
    correctChars = 0;
    errorCount = 0;

    for (let i = 0; i < currentWords.length; i++) {
      const targetWord = currentWords[i];
      const typedWord = wordsTyped[i] || "";
      const wordSpan = wordSpans[i];

      if (!wordSpan) continue;

      if (i < activeWordIndex) {
        if (typedWord === targetWord) {
          wordSpan.classList.add("done-correct");
        } else {
          wordSpan.classList.add("done-error");
        }
      }

      // per-character comparison
      const chars = wordSpan.querySelectorAll(".char");
      chars.forEach((chSpan, idx) => {
        const intended = targetWord[idx];
        const got = typedWord[idx] || "";
        chSpan.classList.remove("current", "incorrect");
        if (i === activeWordIndex) {
          if (got && got !== intended) {
            chSpan.classList.add("incorrect");
          }
        }
      });
    }

    // set active word
    if (wordSpans[activeWordIndex]) {
      wordSpans[activeWordIndex].classList.add("active");
    }

    // caret position inside current word
    const currentTypedWord = wordsTyped[activeWordIndex] || "";
    insertCaret(activeWordIndex, currentTypedWord.length);
    
    updateLiveStats();
  }

  function updateLiveStats() {
    const elapsed = totalTime - timeLeft;
    const elapsedMin = elapsed > 0 ? elapsed / 60 : totalTime / 60;
    const rawWpm =
      elapsedMin > 0 ? Math.round((typedChars / 5) / elapsedMin) : 0;
    const netWpm =
      elapsedMin > 0
        ? Math.max(0, Math.round(((typedChars - errorCount) / 5) / elapsedMin))
        : 0;
    const acc =
      typedChars > 0
        ? Math.round((correctChars / typedChars) * 100)
        : 0;

    rawWpmLiveEl.textContent = rawWpm.toString();
    wpmLiveEl.textContent = netWpm.toString();
    accLiveEl.textContent = acc.toString();
  }

  function finishTest() {
    if (!testRunning) return;
    testRunning = false;
    startBtn.disabled = false;
    hiddenInput.disabled = true;

    if (timerId) clearInterval(timerId);

    // final stats
    const elapsed = totalTime - timeLeft;
    const elapsedMin = elapsed > 0 ? elapsed / 60 : totalTime / 60;
    const rawWpm =
      elapsedMin > 0 ? Math.round((typedChars / 5) / elapsedMin) : 0;
    const netWpm =
      elapsedMin > 0
        ? Math.max(0, Math.round(((typedChars - errorCount) / 5) / elapsedMin))
        : 0;
    const acc =
      typedChars > 0
        ? Math.round((correctChars / typedChars) * 100)
        : 0;

    wpmFinalEl.textContent = netWpm.toString();
    rawWpmFinalEl.textContent = rawWpm.toString();
    accFinalEl.textContent = acc + "%";
    charsFinalEl.textContent = typedChars.toString();
    errorsFinalEl.textContent = errorCount.toString();

    let msg;
    if (netWpm === 0) {
      msg = "Give it another try and see your score!";
    } else if (netWpm < 30) {
      msg = "Nice start! Keep practicing to build speed and accuracy.";
    } else if (netWpm < 60) {
      msg = "Good job! Your typing speed is above average.";
    } else {
      msg = "Great work! That's a very strong typing performance.";
    }
    resultMsgEl.textContent = msg;
    resultsPanel.classList.remove("hidden");

    updateStoredStats(netWpm, acc);
  }

  function updateStoredStats(wpm, acc) {
    const bestWpm =
      parseInt(localStorage.getItem(STORAGE_KEYS.BEST_WPM) || "0", 10) || 0;
    const bestAcc =
      parseInt(localStorage.getItem(STORAGE_KEYS.BEST_ACCURACY) || "0", 10) ||
      0;
    let totalTests =
      parseInt(localStorage.getItem(STORAGE_KEYS.TOTAL_TESTS) || "0", 10) || 0;

    if (wpm > bestWpm) {
      localStorage.setItem(STORAGE_KEYS.BEST_WPM, wpm.toString());
    }
    if (acc > bestAcc) {
      localStorage.setItem(STORAGE_KEYS.BEST_ACCURACY, acc.toString());
    }
    totalTests += 1;
    localStorage.setItem(STORAGE_KEYS.TOTAL_TESTS, totalTests.toString());
  }

  // events
  startBtn.addEventListener("click", startTest);
  restartBtn.addEventListener("click", restartTest);
  hiddenInput.addEventListener("input", handleInput);
  display.addEventListener("click", () => {
    if (!hiddenInput.disabled) hiddenInput.focus();
  });
}

// ------------------ FAQ (about page) ------------------

function initFAQ() {
  const buttons = document.querySelectorAll(".faq-question");
  if (!buttons.length) return;
  buttons.forEach((btn) => {
    const answer = btn.nextElementSibling;
    if (!answer) return;
    // start collapsed
    answer.style.display = "none";
    btn.addEventListener("click", () => {
      const visible = answer.style.display === "block";
      answer.style.display = visible ? "none" : "block";
    });
  });
}

// ------------------ Stat page ------------------

function initLeaderboardPage() {
  const bestWpmEl = $("#best-wpm-stat");
  const bestAccEl = $("#best-accuracy-stat");
  const totalTestsEl = $("#total-tests-stat");
  if (!bestWpmEl || !bestAccEl || !totalTestsEl) return;

  const bestWpm = localStorage.getItem(STORAGE_KEYS.BEST_WPM) || "0";
  const bestAcc = localStorage.getItem(STORAGE_KEYS.BEST_ACCURACY) || "0";
  const totalTests = localStorage.getItem(STORAGE_KEYS.TOTAL_TESTS) || "0";

  bestWpmEl.textContent = bestWpm;
  bestAccEl.textContent = bestAcc + "%";
  totalTestsEl.textContent = totalTests;
}
