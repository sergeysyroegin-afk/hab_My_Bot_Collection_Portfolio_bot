// Элементы
const playerDie = document.getElementById("player-die");
const pcDie = document.getElementById("pc-die");
const resultMessage = document.getElementById("result-message");
const rollBtn = document.getElementById("roll-btn");
const winsSpan = document.getElementById("wins");
const lossesSpan = document.getElementById("losses");

// Параметры
let wins = 0;
let losses = 0;

// Вибрация
function vibrate() {
  if ("vibrate" in navigator) {
    navigator.vibrate(50);
  }
}

// Звук
function playDiceSound() {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = "triangle";
    osc.frequency.value = 300;
    gain.gain.value = 0.1;
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.3);
  } catch (e) {
    console.warn("Звук не воспроизведён");
  }
}

// Генерация числа 1–6
function rollDie() {
  return Math.floor(Math.random() * 6) + 1;
}

// Анимация броска
function animateDie(dieElement) {
  dieElement.classList.add("shaking");
  dieElement.textContent = "?";

  setTimeout(() => {
    dieElement.classList.remove("shaking");
  }, 500);
}

// Окончательное значение
function setDieValue(dieElement, value) {
  dieElement.textContent = value;
}

// Обновление счёта
function updateScore() {
  winsSpan.textContent = wins;
  lossesSpan.textContent = losses;
}

// Бросок
rollBtn.addEventListener("click", () => {
  rollBtn.disabled = true;
  resultMessage.textContent = "Ты бросаешь...";

  // Анимация игрока
  animateDie(playerDie);
  const playerRoll = rollDie();

  setTimeout(() => {
    setDieValue(playerDie, playerRoll);
    resultMessage.textContent = "ПК бросает...";

    // Анимация ПК
    animateDie(pcDie);
    const pcRoll = rollDie();

    setTimeout(() => {
      setDieValue(pcDie, pcRoll);

      // Сравнение
      if (playerRoll > pcRoll) {
        resultMessage.innerHTML = "🎉 Ты выиграл!";
        wins++;
      } else if (playerRoll < pcRoll) {
        resultMessage.innerHTML = "😢 ПК выиграл!";
        losses++;
      } else {
        resultMessage.innerHTML = "🤝 Ничья!";
      }

      updateScore();
      rollBtn.disabled = false;
    }, 600);

    // Звук и вибрация
    vibrate();
    playDiceSound();

  }, 600);
});

// Инициализация
document.addEventListener("DOMContentLoaded", () => {
  updateScore();
});