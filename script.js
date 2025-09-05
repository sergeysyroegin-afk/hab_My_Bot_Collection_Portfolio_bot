/**
 * script.js — Портфолио Сергея Вельского
 * Telegram Mini App: тема, приветствие, анимации, навигация
 */

// === 1. Приветствие по имени ===
function initWelcome() {
  const welcomeEl = document.getElementById('welcome');
  let firstName = 'Пользователь';

  if (window.Telegram?.WebApp?.initDataUnsafe?.user) {
    firstName = Telegram.WebApp.initDataUnsafe.user.first_name;
  }

  welcomeEl.textContent = `Добро пожаловать, ${firstName}!`;
}

// === 2. Переключатель темы ===
function initThemeToggle() {
  const btn = document.getElementById('theme-toggle');
  const icon = document.getElementById('theme-icon');
  const body = document.body;

  const savedTheme = localStorage.getItem('theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

  if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
    body.classList.add('dark-theme');
    icon.textContent = '🌙';
  } else {
    icon.textContent = '☀️';
  }

  btn.addEventListener('click', () => {
    icon.style.transition = 'transform 0.3s ease';
    icon.style.transform = 'rotate(360deg)';
    setTimeout(() => icon.style.transform = 'rotate(0deg)', 300);

    if (window.Telegram?.WebApp?.HapticFeedback) {
      Telegram.WebApp.HapticFeedback.impactOccurred('light');
    }

    if (body.classList.contains('dark-theme')) {
      body.classList.remove('dark-theme');
      icon.textContent = '☀️';
      localStorage.setItem('theme', 'light');
    } else {
      body.classList.add('dark-theme');
      icon.textContent = '🌙';
      localStorage.setItem('theme', 'dark');
    }
  });
}

// === 3. Анимация аватара ===
function initAvatarAnimation() {
  const avatar = document.getElementById('avatar');
  if (!avatar) return;

  let isAnimated = false;

  avatar.addEventListener('click', () => {
    if (window.Telegram?.WebApp?.HapticFeedback) {
      Telegram.WebApp.HapticFeedback.impactOccurred('medium');
    }

    if (!isAnimated) {
      avatar.classList.remove('normal');
      avatar.classList.add('animate');      
    } else {
      avatar.classList.remove('animate');
      avatar.classList.add('normal');
    }
    isAnimated = !isAnimated;
  });
}

// === 4. Анимация появления меню ===
function initMenuAnimations() {
  const menuItems = document.querySelectorAll('.menu-item');
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            entry.target.classList.add('visible');
          }, index * 150);
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1, rootMargin: '0px 0px -100px 0px' }
  );

  menuItems.forEach(item => observer.observe(item));
}

// === 5. Язык ===
function initLanguageSelector() {
  const select = document.getElementById('language');
  if (!select) return;

  select.value = window.location.pathname.endsWith('index_en.html') ? 'index_en.html' : 'index.html';

  select.addEventListener('change', () => {
    const selected = select.value;
    localStorage.setItem('preferredLanguage', selected.includes('en') ? 'en' : 'ru');
    window.location.href = selected;
  });
}

// === 6. Telegram WebApp ===
function initTelegram() {
  if (window.Telegram?.WebApp) {
    Telegram.WebApp.ready();
    Telegram.WebApp.expand();
  }
}

// === Запуск ===
document.addEventListener('DOMContentLoaded', () => {
  initTelegram();
  initWelcome();
  initThemeToggle();
  initAvatarAnimation();
  initMenuAnimations();
  initLanguageSelector();
});