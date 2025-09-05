// Вопросы: фрагмент, полное изображение, правильный ответ, варианты
const questions = [
  {
    preview: "assets/preview1.png",
    full: "assets/full1.png",
    correct: "Тралалело Тралала",
    options: [
      "Капучино Ассассино",
      "Бомбомбини гузини",
      "Тралалело Тралала",
      "Бом Бом Бом Бом Бом Газун"
    ]
  },
    {
    preview: "assets/preview3.jpg",
    full: "assets/full3.jpg",
    correct: "Бомбардиро Крокодило",
    options: [
      "Капучино Ассассино",
      "Бомбардиро Крокодило",
      "Лирили Ларила",
      "Бом Бом Бом Бом Бом Газун"
    ]
  },
    {
    preview: "assets/preview4.png",
    full: "assets/full4.png",
    correct: "Шимпанзини Бананини",
    options: [
      "Шимпанзини Бананини",
      "Орангутини Ананасини",
      "Тралалело Тралала",
      "Ла Вака Сатурно Сатурнита"
    ]
  },
    {
    preview: "assets/preview5.png",
    full: "assets/full5.png",
    correct: "Тун тун тун Сахур",
    options: [
      "Шпиониро Голубиро",
      "Тун тун тун Сахур",
      "Тракутулутулу Делапеладустуз ",
      "Фриго Камело"
    ]
  },
    {
    preview: "assets/preview6.jpg",
    full: "assets/full6.jpg",
    correct: "Лирили Ларила",
    options: [
      "Маусини Кводрокоптини",
      "Трулимеро Труличина",
      "Фриго Камело",
      "Лирили Ларила"
    ]
  },
    {
    preview: "assets/preview7.jpg",
    full: "assets/full7.jpg",
    correct: "Трипи Тропи",
    options: [
      "Бобрито Бандито",
      "Бомбомбини гузини",
      "Трипи Тропи",
      "Тракутулутулу "
    ]
  },
    {
    preview: "assets/preview8.png",
    full: "assets/full8.png",
    correct: "Бобрито Бандито",
    options: [
      "Бобрито Бандито",
      "Фриго Камело ",
      "Димин ди дау ",
      "Бом Бом Бом Бом Бом Газун"
    ]
  },
    {
    preview: "assets/preview9.jpg",
    full: "assets/full9.jpg",
    correct: "Фрули Фрула",
    options: [
      "Фрули Фрула",
      "Фриго Камело",
      "Лирили Ларила",
      "Трулимеро Труличина"
    ]
  },
    {
    preview: "assets/preview10.png",
    full: "assets/full10.png",
    correct: "Бомбомбини гузини",
    options: [
      "Капучино Ассассино",
      "Трулимеро Труличина",
      "Тралалело Тралала",
      "Бомбомбини гузини"
    ]
  },
    {
    preview: "assets/preview11.png",
    full: "assets/full11.png",
    correct: "Трулимеро Труличино",
    options: [
      "Трулимеро Труличино",
      "Бомбомбини гузини",
      "Булличини Бананини",
      "Глорбо-фрутодрилло"
    ]
  },
    {
    preview: "assets/preview12.png",
    full: "assets/full12.png",
    correct: "Бр Бр Патапим",
    options: [
      "Капучино Ассассино",
      "Бомбомбини гузини",
      "Бр Бр Патапим",
      "Трулимеро Труличина"
    ]
  },
  {
    preview: "assets/preview2.jpg",
    full: "assets/full2.jpg",
    correct: "Балерина Капучина",
    options: [
      "Шимпанзини Бананини",
      "Триппи Троппо Троппа Триппа ",
      "Пипи Потато",
      "Балерина Капучина"
    ]
  }

];

let currentQuestion = 0;
let score = 0;
let timer = null;
let timeLeft = 10;

// Основные элементы
const questionContainer = document.getElementById("question-container");
const resultScreen = document.getElementById("result-screen");
const endScreen = document.getElementById("end-screen");
const memePreview = document.getElementById("meme-preview");
const optionsContainer = document.getElementById("options");
const nextBtn = document.getElementById("next-btn");
const resultMessage = document.getElementById("result-message");
const fullMeme = document.getElementById("full-meme");
const nextQuestionBtn = document.getElementById("next-question-btn");

// Счётчик
const scoreSpan = document.getElementById("score");
const totalSpan = document.getElementById("total");

// Таймер
const timerElement = document.getElementById("timer");

// Экран окончания
const finalScoreSpan = document.getElementById("final-score");
const totalQuestionsSpan = document.getElementById("total-questions");
const playAgainBtn = document.getElementById("play-again-btn");

// Обновление счёта
function updateScore() {
  scoreSpan.textContent = score;
  totalSpan.textContent = questions.length;
}

// Запуск таймера
function startTimer() {
  timeLeft = 10;
  timerElement.textContent = timeLeft;
  timerElement.className = "timer";

  if (timer) clearInterval(timer);

  timer = setInterval(() => {
    timeLeft--;
    timerElement.textContent = timeLeft;

    if (timeLeft <= 3) {
      timerElement.className = "timer danger";
    } else if (timeLeft <= 6) {
      timerElement.className = "timer warning";
    }

    if (timeLeft <= 0) {
      clearInterval(timer);
      timeIsUp();
    }
  }, 1000);
}

// Время вышло
function timeIsUp() {
  document.querySelectorAll(".option-btn").forEach((btn) => {
    btn.disabled = true;
  });

  const q = questions[currentQuestion];
  resultMessage.textContent = `⏰ Время вышло! Правильный ответ: "${q.correct}"`;
  fullMeme.src = q.full;
  fullMeme.onerror = () => {
    fullMeme.src = "https://via.placeholder.com/400?text=Полный+мем";
  };

  questionContainer.style.display = "none";
  resultScreen.style.display = "block";
}

// Остановка таймера
function stopTimer() {
  if (timer) {
    clearInterval(timer);
    timer = null;
  }
}

// Загрузка вопроса
function loadQuestion() {
  const q = questions[currentQuestion];
  memePreview.src = q.preview;
  memePreview.onerror = () => {
    memePreview.src = "https://via.placeholder.com/300?text=Фрагмент+мема";
  };

  optionsContainer.innerHTML = "";
  q.options.forEach((option) => {
    const button = document.createElement("button");
    button.classList.add("option-btn");
    button.textContent = option;
    button.addEventListener("click", () => {
      stopTimer();
      selectOption(button, option === q.correct);
    });
    optionsContainer.appendChild(button);
  });

  nextBtn.disabled = true;
  questionContainer.style.display = "block";
  resultScreen.style.display = "none";
  endScreen.style.display = "none";

  stopTimer();
  startTimer();
  updateScore();
}

// Выбор ответа
function selectOption(button, isCorrect) {
  document.querySelectorAll(".option-btn").forEach((btn) => {
    btn.disabled = true;
    btn.classList.remove("selected");
  });
  button.classList.add("selected");

  if (isCorrect) {
    score++;
  }

  nextBtn.disabled = false;
  nextBtn.onclick = () => showResult(isCorrect);
}

// Показ результата
function showResult(isCorrect) {
  const q = questions[currentQuestion];
  resultMessage.textContent = isCorrect
    ? "🎉 Правильно! Вот полный мем:"
    : `🤔 Неправильно. Правильный ответ: "${q.correct}"`;

  fullMeme.src = q.full;
  fullMeme.onerror = () => {
    fullMeme.src = "https://via.placeholder.com/400?text=Полный+мем";
  };

  stopTimer();
  questionContainer.style.display = "none";
  resultScreen.style.display = "block";
  updateScore();
}

// Переход к следующему вопросу или конец игры
nextQuestionBtn.addEventListener("click", () => {
  currentQuestion++;
  if (currentQuestion >= questions.length) {
    showEndScreen();
  } else {
    loadQuestion();
  }
});

// Показ экрана окончания
function showEndScreen() {
  finalScoreSpan.textContent = score;
  totalQuestionsSpan.textContent = questions.length;

  questionContainer.style.display = "none";
  resultScreen.style.display = "none";
  endScreen.style.display = "block";
}

// Кнопка "Играть снова"
playAgainBtn.addEventListener("click", () => {
  currentQuestion = 0;
  score = 0;
  endScreen.style.display = "none";
  loadQuestion();
});

// Инициализация при загрузке
document.addEventListener("DOMContentLoaded", () => {
  totalQuestionsSpan.textContent = questions.length; // Устанавливаем общее количество
  updateScore();
  loadQuestion();
});