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
//   ЦВЕТ ПО ИНИЦИАЛУ
// ====================

function getInitialColor(char) {
  const colors = [
    "#FFB3BA", "#FFDFBA", "#FFFFBA", "#BAFFC9", "#BAE1FF", "#D9BAFF", "#FFB3B3", "#FFD1B3"
  ];
  const charCode = char.toUpperCase().charCodeAt(0);
  return colors[charCode % colors.length];
}

// ====================
//   АВАТАР И ПРИВЕТСТВИЕ (с инициалом, но без фото из Telegram)
// ====================

document.addEventListener("DOMContentLoaded", () => {
  loadTheme();

  const userAvatar = document.getElementById("user-avatar");
  const userName = document.getElementById("user-name");

  // Всегда используем стандартное изображение как fallback
  userAvatar.src = "default-avatar.png";
  userAvatar.alt = "Аватар пользователя";

  if (window.Telegram && Telegram.WebApp) {
    const user = Telegram.WebApp.initDataUnsafe.user;

    if (user) {
      // Формируем имя
      const displayName = user.username
        ? `@${user.username}`
        : user.first_name || "Игрок";

      userName.textContent = `Привет, ${displayName}!`;

      // Получаем первую букву для инициала
      const firstName = user.first_name || user.username || "A";
      const initial = firstName.charAt(0).toUpperCase();

      // Убираем src, чтобы не мешал цветному кругу
      userAvatar.removeAttribute("src");
      userAvatar.textContent = initial;
      userAvatar.style.background = getInitialColor(initial);
      userAvatar.style.display = "flex";
      userAvatar.style.alignItems = "center";
      userAvatar.style.justifyContent = "center";
      userAvatar.style.fontSize = "24px";
      userAvatar.style.fontWeight = "bold";
      userAvatar.style.color = "#fff";
      userAvatar.style.objectFit = "none";
    }
  } else {
    // Режим тестирования
    userName.textContent = "Привет, Игрок!";
  }

  // ====================
  //   ИНТЕРАКТИВ С АВАТАРОМ
  // ====================

  // Вибрация
  function vibrate() {
    if ("vibrate" in navigator) {
      navigator.vibrate(50);
    }
  }

  // Звук через Web Audio API (без файла)
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

  // Клик: анимация + вибрация + звук
  userAvatar.addEventListener("click", () => {
    userAvatar.classList.add("jiggle");
    setTimeout(() => {
      userAvatar.classList.remove("jiggle");
    }, 600);

    vibrate();
    playPipSound();
  });
});