// Управление темой
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

// Генерация цвета по символу
function getInitialColor(char) {
  const colors = [
    "#FFB3BA", "#FFDFBA", "#FFFFBA", "#BAFFC9", "#BAE1FF", "#D9BAFF", "#FFB3B3", "#FFD1B3"
  ];
  const charCode = char.toUpperCase().charCodeAt(0);
  return colors[charCode % colors.length];
}

// Загрузка аватара и имени
document.addEventListener("DOMContentLoaded", () => {
  loadTheme();

  const userAvatar = document.getElementById("user-avatar");
  const userName = document.getElementById("user-name");

  if (window.Telegram && Telegram.WebApp) {
    const user = Telegram.WebApp.initDataUnsafe.user;

    if (user) {
      const username = user.username ? `@${user.username}` : "Пользователь";
      const firstName = user.first_name || user.username || "User";

      userName.textContent = `Привет, ${username}!`;

      // Показываем первую букву имени
      const initial = firstName.charAt(0).toUpperCase();

      // Убираем src, чтобы не мешал
      userAvatar.removeAttribute("src");
      userAvatar.alt = `Аватар ${firstName}`;

      // Стилизуем аватар как цветной кружок с буквой
      userAvatar.style.background = getInitialColor(initial);
      userAvatar.style.display = "flex";
      userAvatar.style.alignItems = "center";
      userAvatar.style.justifyContent = "center";
      userAvatar.style.fontSize = "24px";
      userAvatar.style.fontWeight = "bold";
      userAvatar.style.color = "#fff";
      userAvatar.style.textAlign = "center";
      userAvatar.style.objectFit = "none";
      userAvatar.textContent = initial;

      // Анимация прыжка при клике
      userAvatar.addEventListener("click", () => {
        userAvatar.classList.add("jiggle");
        setTimeout(() => {
          userAvatar.classList.remove("jiggle");
        }, 600);
      });
    }
  } else {
    // Режим тестирования — стандартный аватар
    userName.textContent = "Привет, Пользователь!";
    userAvatar.src = "default-avatar.png";
    userAvatar.alt = "Стандартный аватар";
    userAvatar.style.display = "block";
    userAvatar.textContent = ""; // очищаем текст

    userAvatar.addEventListener("click", () => {
      alert("В Telegram здесь будет ваша инициал и цветной аватар!");
    });
  }
});