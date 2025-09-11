// ====================
//   УПРАВЛЕНИЕ ТЕМОЙ
// ====================

const themeToggle = document.getElementById("theme-toggle");
let isDark = false;

function loadTheme() {
  const savedTheme = localStorage.getItem("gamecentr-theme");
  if (savedTheme === "dark") {
    setDarkTheme();
    isDark = true;
  } else {
    setLightTheme();
    isDark = false;
  }
}

function setDarkTheme() {
  document.body.setAttribute("data-theme", "dark");
  themeToggle.textContent = "🌙";
}

function setLightTheme() {
  document.body.removeAttribute("data-theme");
  themeToggle.textContent = "🌞";
}

themeToggle.addEventListener("click", () => {
  isDark = !isDark;
  if (isDark) {
    setDarkTheme();
  } else {
    setLightTheme();
  }
  localStorage.setItem("gamecentr-theme", isDark ? "dark" : "light");
});

// ====================
//   ИМЯ ПОЛЬЗОВАТЕЛЯ ИЗ TELEGRAM
//   Аватар остаётся стандартным
// ====================

document.addEventListener("DOMContentLoaded", () => {
  loadTheme();

  const userNameElement = document.getElementById("user-name");

  // Приветствие по умолчанию
  let displayName = "Игрок";

  if (window.Telegram && Telegram.WebApp) {
    const user = Telegram.WebApp.initDataUnsafe.user;

    if (user) {
      // Приоритет: username → first_name → fallback
      if (user.username) {
        displayName = `@${user.username}`;
      } else if (user.first_name) {
        displayName = user.first_name;
      }
    }
  }

  // Устанавливаем приветствие
  userNameElement.textContent = `Привет, ${displayName}!`;

  // ====================
  //   ИНТЕРАКТИВ С АВАТАРОМ (опционально)
  // ====================

  const userAvatar = document.getElementById("user-avatar");

  // Вибрация
  function vibrate() {
    if ("vibrate" in navigator) {
      navigator.vibrate(50);
    }
  }

  // Звук через Web Audio API
  function playPipSound() {
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = "square";
      osc.frequency.value = 700;
      gain.gain.value = 0.2;
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.15);
    } catch (e) {
      console.warn("Не удалось воспроизвести звук:", e);
    }
  }

  // Клик по аватару — анимация + вибрация + звук
  userAvatar.addEventListener("click", () => {
    userAvatar.classList.add("jiggle");
    setTimeout(() => {
      userAvatar.classList.remove("jiggle");
    }, 600);

    vibrate();
    playPipSound();
  });
});
