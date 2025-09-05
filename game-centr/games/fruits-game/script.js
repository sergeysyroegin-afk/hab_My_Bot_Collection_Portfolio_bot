// Список фруктов: хорошие и плохие
const FRUITS = [
  { src: "apple.png", type: "good" },
  { src: "banana.png", type: "good" },
  { src: "orange.png", type: "good" },
  { src: "bad-apple.png", type: "bad" },
  { src: "can.png", type: "bad" }
];

// Переменные игры
let score = 0;
let lives = 3;
let gameActive = false;
let fruitInterval;
let speed = 2;
let currentLevel = 0;

// DOM-элементы
const startScreen = document.getElementById("start-screen");
const gameScreen = document.getElementById("game-screen");
const endScreen = document.getElementById("end-screen");
const scoreElement = document.getElementById("score");
const finalScoreElement = document.getElementById("final-score");
const recordElement = document.getElementById("record");
const livesElement = document.getElementById("lives");
const levelDisplay = document.getElementById("level-display");
const gameArea = document.getElementById("game-area");
const startButton = document.getElementById("start-button");
const restartButton = document.getElementById("restart-button");
const soundToggle = document.getElementById("sound-toggle");

// Звуки
const popSound = document.getElementById("pop-sound");
const errorSound = document.getElementById("error-sound");
const levelUpSound = document.getElementById("level-up-sound");

// Настройка звука
let soundEnabled = true;
if (localStorage.getItem("soundEnabled") === "false") {
  soundEnabled = false;
}
soundToggle.textContent = soundEnabled ? "🔊" : "🔇";
if (!soundEnabled) {
  soundToggle.classList.add("muted");
}

// Рекорд
let record = parseInt(localStorage.getItem("fruitGameRecord")) || 0;
recordElement.textContent = `Рекорд: ${record}`;

// Telegram WebApp — расширяем экран
if (window.Telegram?.WebApp) {
  Telegram.WebApp.expand();
}

// Обработчики кнопок
startButton.addEventListener("click", startGame);
restartButton.addEventListener("click", startGame);

soundToggle.addEventListener("click", () => {
  soundEnabled = !soundEnabled;
  localStorage.setItem("soundEnabled", soundEnabled);

  soundToggle.textContent = soundEnabled ? "🔊" : "🔇";
  soundToggle.classList.toggle("muted");

  if (!soundEnabled) {
    popSound.pause(); popSound.currentTime = 0;
    errorSound.pause(); errorSound.currentTime = 0;
    levelUpSound.pause(); levelUpSound.currentTime = 0;
  }
});

// Функция запуска игры
function startGame() {
  score = 0;
  lives = 3;
  gameActive = true;
  speed = 2;
  currentLevel = 0; // сбросим
  scoreElement.textContent = `Очки: ${score}`;
  updateLivesDisplay();
  gameArea.innerHTML = "";

  // Обновляем уровень при старте
  updateDifficulty();

  startScreen.classList.add("hidden");
  gameScreen.classList.remove("hidden");
  endScreen.classList.add("hidden");
}

// Обновление отображения жизей
function updateLivesDisplay() {
  livesElement.textContent = "❤️".repeat(lives);
}

// Получение параметров сложности по счёту
function getDifficulty() {
  if (score < 10) return { badFruitChance: 0.2, spawnDelay: 1500, speed: 2.5, level: 1 };
  if (score < 25) return { badFruitChance: 0.25, spawnDelay: 1200, speed: 3, level: 2 };
  if (score < 50) return { badFruitChance: 0.3, spawnDelay: 900, speed: 3.5, level: 3 };
  if (score < 100) return { badFruitChance: 0.35, spawnDelay: 700, speed: 3.8, level: 4 };
  return { badFruitChance: 0.5, spawnDelay: 500, speed: 4.5, level: 5 };
}

// Обновление сложности (вызывается при росте счёта)
function updateDifficulty() {
  const difficulty = getDifficulty();

  if (difficulty.level > currentLevel) {
    currentLevel = difficulty.level;
    playLevelUpSound();
    // Всплывающее окно больше не нужно
  }

  // Обновляем отображение уровня
  levelDisplay.textContent = `LVL ${currentLevel}`;

  clearInterval(fruitInterval);
  fruitInterval = setInterval(spawnFruit, difficulty.spawnDelay);
  speed = difficulty.speed;

  const fill = Math.min((score / 150) * 100, 100);
  document.getElementById("intensity-fill").style.width = `${fill}%`;
}

// Создание нового фрукта
function spawnFruit() {
  if (!gameActive) return;

  const fruit = document.createElement("div");
  fruit.classList.add("fruit");

  const difficulty = getDifficulty();
  const isBad = Math.random() < difficulty.badFruitChance;

  const availableFruits = isBad
    ? FRUITS.filter(f => f.type === "bad")
    : FRUITS.filter(f => f.type === "good");

  const randomFruit = availableFruits[Math.floor(Math.random() * availableFruits.length)];
  fruit.style.backgroundImage = `url('assets/${randomFruit.src}')`;
  fruit.dataset.type = randomFruit.type;

  // Случайная позиция по горизонтали
  const maxX = gameArea.clientWidth - 60;
  fruit.style.left = Math.random() * maxX + "px";
  fruit.style.top = "0px";

  gameArea.appendChild(fruit);

  // Движение фрукта вниз
  let moveFruit;
  moveFruit = setInterval(() => {
    if (!gameActive) {
      clearInterval(moveFruit);
      return;
    }

    const currentTop = parseFloat(fruit.style.top);
    fruit.style.top = currentTop + speed + "px";

    // Проверка: достиг ли фрукт низа экрана
    if (currentTop > gameArea.clientHeight) {
      if (randomFruit.type === "good") {
        lives--;
        updateLivesDisplay();
        playErrorSound();
        if (lives <= 0) {
          endGame();
        }
      }
      fruit.remove();
      clearInterval(moveFruit);
    }
  }, 50);

  // Обработка клика по фрукту
  fruit.addEventListener("click", () => {
    if (!gameActive) return;

    fruit.classList.add("pop");
    setTimeout(() => {
      fruit.remove();
      clearInterval(moveFruit);
    }, 300);

    if (randomFruit.type === "good") {
      score++;
      scoreElement.textContent = `Очки: ${score}`;
      playPopSound();
      createExplosion(fruit);
      updateDifficulty(); // Пересчитываем сложность
    } else if (randomFruit.type === "bad") {
      lives--;
      updateLivesDisplay();
      playErrorSound();
      if (lives <= 0) {
        endGame();
      }
    }
  });
}

// Эффект взрыва (частицы)
function createExplosion(fruit) {
  const rect = fruit.getBoundingClientRect();
  const x = rect.left + rect.width / 2;
  const y = rect.top + rect.height / 2;

  for (let i = 0; i < 5; i++) {
    const particle = document.createElement("div");
    particle.classList.add("particle");

    const angle = Math.random() * Math.PI * 2;
    const speed = 2 + Math.random() * 3;
    const vx = Math.cos(angle) * speed;
    const vy = Math.sin(angle) * speed;

    particle.style.left = `${x}px`;
    particle.style.top = `${y}px`;
    document.body.appendChild(particle);

    let px = x, py = y;
    const move = setInterval(() => {
      px += vx;
      py += vy;
      particle.style.left = `${px}px`;
      particle.style.top = `${py}px`;

      if (py > window.innerHeight || px < 0 || px > window.innerWidth) {
        particle.remove();
        clearInterval(move);
      }
    }, 16);

    setTimeout(() => {
      particle.remove();
      clearInterval(move);
    }, 500);
  }
}

// Всплывающее уведомление уровня
function showLevelUp(level) {
  const popup = document.getElementById("level-up-popup");
  const levelNumber = document.getElementById("level-number");
  levelNumber.textContent = level;
  popup.classList.add("show");

  setTimeout(() => {
    popup.classList.remove("show");
  }, 2000);
}

// Звуки (с проверкой включённости)
function playPopSound() {
  if (soundEnabled) popSound.play().catch(() => {});
}

function playErrorSound() {
  if (soundEnabled) errorSound.play().catch(() => {});
}

function playLevelUpSound() {
  if (soundEnabled) levelUpSound.play().catch(() => {});
}

// Окончание игры
function endGame() {
  gameActive = false;
  clearInterval(fruitInterval);
  gameArea.innerHTML = "";

  finalScoreElement.textContent = `Ты собрал: ${score} фруктов`;
  if (score > record) {
    record = score;
    localStorage.setItem("fruitGameRecord", record);
    recordElement.textContent = `Рекорд: ${record}`;
  }

  gameScreen.classList.add("hidden");
  endScreen.classList.remove("hidden");
}

// Поделиться результатом
shareButton.addEventListener("click", () => {
  const message = `Я собрал ${score} фруктов в игре "Не пропусти фрукт"! А ты сколько соберёшь?`;
  if (window.Telegram?.WebApp) {
    Telegram.WebApp.sendData(message);
  } else {
    alert(message);
  }
});

