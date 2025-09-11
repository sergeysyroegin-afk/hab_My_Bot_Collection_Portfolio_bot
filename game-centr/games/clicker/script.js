// Элементы
const scoreElement = document.getElementById("score");
const clicksElement = document.getElementById("clicks");
const capyImg = document.getElementById("capy-img");
const clickBtn = document.getElementById("click-btn");
const upgradeClickBtn = document.getElementById("upgrade-click");
const autoClickBtn = document.getElementById("auto-click");
const clickCostSpan = document.getElementById("click-cost");
const autoCostSpan = document.getElementById("auto-cost");

// Параметры
let score = 0;
let clicks = 0;
let clickPower = 1;
let autoClickLevel = 0;
let autoClickInterval = null;

// Пороги для смены изображения
const capyLevels = [
  { threshold: 0,   src: "assets/capybara1.png",   desc: "Милый новичок" },
  { threshold: 20,  src: "assets/capybara2.png",   desc: "Уверенный в себе" },
  { threshold: 70,  src: "assets/capybara3.png",   desc: "В очках и с планами" },
  { threshold: 120, src: "assets/capybara4.png",   desc: "С бородой и мудростью" },
  { threshold: 500, src: "assets/capybara5.png",   desc: "Капибара-босс" }
];

// Стоимость улучшений
let upgradeClickCost = 10;
let autoClickCost = 50;

// ====================
//   ВИБРАЦИЯ (на мобильных)
// ====================

function vibrate() {
  if ("vibrate" in navigator) {
    navigator.vibrate(50); // 50 мс вибрации
  }
}

// Звук клика
function playClickSound() {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = "sine";
    osc.frequency.value = 600;
    gain.gain.value = 0.15;
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.1);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.1);
  } catch (e) {
    console.warn("Звук не воспроизведён");
  }
}

// Обновление изображения капибары
function updateCapyImage() {
  for (let i = capyLevels.length - 1; i >= 0; i--) {
    if (clicks >= capyLevels[i].threshold) {
      capyImg.src = capyLevels[i].src;
      capyImg.alt = capyLevels[i].desc;
      break;
    }
  }
}

// Обновление интерфейса
function updateUI() {
  scoreElement.textContent = score;
  clicksElement.textContent = clicks;
  clickCostSpan.textContent = upgradeClickCost;
  autoCostSpan.textContent = autoClickCost;

  upgradeClickBtn.disabled = score < upgradeClickCost;
  autoClickBtn.disabled = score < autoClickCost;

  // Обновляем текст кнопки автоклика
  if (autoClickLevel === 0) {
    autoClickBtn.textContent = `Автоклик (+1 в сек) — ${autoClickCost} очков`;
  } else {
    autoClickBtn.textContent = `Усилить автоклик — ${autoClickCost} очков`;
  }
}

// === ЭФФЕКТЫ ===

// Показать всплывающий текст +1, +2 и т.д.
function showFloatingText() {
  const text = document.createElement("div");
  text.classList.add("floating-text");
  text.textContent = `+${clickPower}`;
  
  const capyRect = capyImg.getBoundingClientRect();
  const container = document.querySelector(".capy-container");

  text.style.left = `${capyRect.width / 2}px`;
  text.style.bottom = `${capyRect.height - 20}px`;

  container.appendChild(text);

  setTimeout(() => {
    text.classList.add("show");
  }, 10);

  setTimeout(() => {
    text.remove();
  }, 1000);
}

// Создать частицы (искры)
function createParticles() {
  const container = document.querySelector(".capy-container");
  const capyRect = capyImg.getBoundingClientRect();

  const x = capyRect.width / 2;
  const y = capyRect.height / 2;

  for (let i = 0; i < 6; i++) {
    const particle = document.createElement("div");
    particle.classList.add("particle");

    const angle = Math.random() * Math.PI * 2;
    const speed = 20 + Math.random() * 20;
    const vx = Math.cos(angle) * speed;
    const vy = Math.sin(angle) * speed;

    particle.style.left = `${x}px`;
    particle.style.top = `${y}px`;

    container.appendChild(particle);

    let startTime = null;
    const duration = 600 + Math.random() * 400;

    function animateParticle(timestamp) {
      if (!startTime) startTime = timestamp;
      const progress = timestamp - startTime;
      const ease = 1 - Math.pow(1 - progress / duration, 3);

      const currentX = x + vx * ease;
      const currentY = y + vy * ease;
      const currentOpacity = 1 - ease;

      particle.style.transform = `translate(${currentX - x}px, ${currentY - y}px)`;
      particle.style.opacity = currentOpacity;

      if (progress < duration) {
        requestAnimationFrame(animateParticle);
      } else {
        particle.remove();
      }
    }

    requestAnimationFrame(animateParticle);
  }
}

// === ОСНОВНОЙ КЛИК ===
clickBtn.addEventListener("click", () => {
  score += clickPower;
  clicks++;
  playClickSound();
  vibrate();
  showFloatingText();
  createParticles();

  updateUI();
  updateCapyImage();
});

// === УЛУЧШЕНИЕ: СИЛА КЛИКА ===
upgradeClickBtn.addEventListener("click", () => {
  if (score >= upgradeClickCost) {
    score -= upgradeClickCost;
    clickPower++;
    upgradeClickCost = Math.floor(upgradeClickCost * 1.6);
    updateUI();
  }
});

// === УЛУЧШЕНИЕ: АВТОКЛИК (МНОГОУРОВНЕВЫЙ) ===
autoClickBtn.addEventListener("click", () => {
  if (score >= autoClickCost) {
    score -= autoClickCost;
    autoClickLevel++;

    // Частота: ускоряется с каждым уровнем (минимум 200мс)
    const interval = Math.max(200, 1000 - autoClickLevel * 100);

    // Перезапускаем интервал
    if (autoClickInterval) {
      clearInterval(autoClickInterval);
    }

    autoClickInterval = setInterval(() => {
      score++;
      updateUI();
      updateCapyImage();
    }, interval);

    // Увеличиваем стоимость следующего улучшения
    autoClickCost = Math.floor(autoClickCost * 2);
    updateUI();
  }
});

// === ИНИЦИАЛИЗАЦИЯ ===
document.addEventListener("DOMContentLoaded", () => {
  updateUI();
  updateCapyImage();
});
