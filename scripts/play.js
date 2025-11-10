function saveQuestion() {
  const questionText = document.getElementById('questionText').value;
  const answerInputs = document.querySelectorAll('#create .answer-input');
  const checkBoxes = document.querySelectorAll('#create .correct-check');

  let answers = [];
  let correct = [];

  answerInputs.forEach((input, index) => {
    answers.push(input.value);
    if (checkBoxes[index].checked) correct.push(index);
  });

  let questions = JSON.parse(localStorage.getItem('quizQuestions')) || [];
  questions.push({ question: questionText, answers, correct });

  localStorage.setItem('quizQuestions', JSON.stringify(questions));

  document.getElementById('questionText').value = '';
  answerInputs.forEach(input => input.value = '');
  checkBoxes.forEach(checkbox => checkbox.checked = false);

  alert('Питання збережено!');
}

let questionsCounter = 0;

function startQuiz(category) {
  const container = document.querySelector('.quiz-container');

  // Завантажуємо всі питання
  const allQuestions = JSON.parse(localStorage.getItem('quizQuestions')) || [];
  let usedQuestions = JSON.parse(localStorage.getItem('usedQuestions')) || [];

  // Вибираємо питання по категорії або всі
  let availableQuestions;
  if (category === "random") {
    availableQuestions = allQuestions.filter(
      q => !usedQuestions.some(u => u.question === q.question)
    );
  } else {
    availableQuestions = allQuestions.filter(
      q => q.category === category && !usedQuestions.some(u => u.question === q.question)
    );
  }

  // Якщо питань більше немає — завершення
  if (availableQuestions.length === 0) {
    alert("Категорія пройдена!");
    container.innerHTML = `<p>Усі питання для категорії <b>${category}</b> вже пройдені!</p>`;
    localStorage.removeItem('usedQuestions');
    questionsCounter = 0;
    return;
  }

  // Випадкове питання
  const element = Math.floor(Math.random() * availableQuestions.length);
  const q = availableQuestions[element];

  // Додаємо до використаних
  usedQuestions.push(q);
  localStorage.setItem('usedQuestions', JSON.stringify(usedQuestions));

  questionsCounter++;

  // Виводимо питання
  container.innerHTML = `
    <h2>${q.question}</h2>
    ${q.answers.map(
      (opt, i) => `
        <label>
          <input type="radio" name="answer" value="${i}">
          ${opt}
        </label><br>
      `
    ).join('')}
    <button id="submitBtn">Відповісти</button>
  `;

  // Обробник кнопки
  document.getElementById('submitBtn').addEventListener('click', () => {
    const selected = document.querySelector('input[name="answer"]:checked');
    if (!selected) {
      alert("Спочатку вибери відповідь!");
      return;
    }

    // Перевірка відповіді
    const answerIndex = parseInt(selected.value);
    if (q.correct.includes(answerIndex)) {
      alert("✅ Правильно!");
    } else {
      alert(`❌ Неправильно! Правильна відповідь: ${q.answers[q.correct[0]]}`);
    }

    // Для рандомного тесту — максимум 10 питань
    if (category === "random") {
      if (questionsCounter >= 10) {
        alert("Тест завершено!");
        container.innerHTML = `<p>Усі питання для категорії <b>${category}</b> вже пройдені!</p>`;
        localStorage.removeItem('usedQuestions');
        questionsCounter = 0;
        return;
      }
    } else {
      if (questionsCounter >= availableQuestions.length) {
        localStorage.removeItem('usedQuestions');
        questionsCounter = 0;
        alert("Категорію завершено!");
        return;
      }
    }

    // Продовжуємо квіз
    startQuiz(category);
  });
}

function checkResults(questions) {
  let score = 0;
  questions.forEach((q, index) => {
    const selected = Array.from(document.querySelectorAll(`input[name='q${index}']:checked`))
      .map(el => parseInt(el.value));
    if (JSON.stringify(selected.sort()) === JSON.stringify(q.correct.sort())) score++;
  });

  const percent = ((score / questions.length) * 100).toFixed(2);
  document.getElementById('result').innerHTML = `Правильних відповідей: ${score} із ${questions.length} (${percent}%)`;
}

// Optional: preload one sample question
let questions = JSON.parse(localStorage.getItem('quizQuestions')) || [];

if (questions.length === 0) {
  questions.push(
    {
      category: "Історія",
      question: "Коли відбулася битва під Крутами?",
      answers: ["1917", "1918", "1919", "1920"],
      correct: [1]
    },
    {
      category: "Історія",
      question: "Хто був першим президентом США?",
      answers: ["Авраам Лінкольн", "Джордж Вашингтон", "Томас Джефферсон", "Джон Адамс"],
      correct: [1]
    },
    {
      category: "Історія",
      question: "У якому році почалася Перша світова війна?",
      answers: ["1912", "1914", "1916", "1918"],
      correct: [1]
    },
    {
      category: "Історія",
      question: "Яка країна першою відправила людину в космос?",
      answers: ["США", "СРСР", "Китай", "Німеччина"],
      correct: [1]
    },
    {
      category: "Історія",
      question: "Хто був правителем Київської Русі під час хрещення?",
      answers: ["Ярослав Мудрий", "Святослав", "Володимир Великий", "Олег"],
      correct: [2]
    },
    {
      category: "Географія",
      question: "Яка найвища гора у світі?",
      answers: ["Кіліманджаро", "Еверест", "Монблан", "Аконкагуа"],
      correct: [1]
    },
    {
      category: "Географія",
      question: "Яка річка є найдовшою у світі?",
      answers: ["Амазонка", "Ніл", "Янцзи", "Міссісіпі"],
      correct: [1]
    },
    {
      category: "Географія",
      question: "Скільки континентів на Землі?",
      answers: ["5", "6", "7", "8"],
      correct: [2]
    },
    {
      category: "Географія",
      question: "Яка столиця Канади?",
      answers: ["Торонто", "Оттава", "Монреаль", "Ванкувер"],
      correct: [1]
    },
    {
      category: "Географія",
      question: "Яка країна має найбільшу площу у світі?",
      answers: ["Канада", "США", "Китай", "росія"],
      correct: [3]
    },
    {
      category: "Математика",
      question: "Чому дорівнює 9 × 7?",
      answers: ["56", "63", "72", "69"],
      correct: [1]
    },
    {
      category: "Математика",
      question: "Який корінь з 81?",
      answers: ["8", "9", "10", "11"],
      correct: [1]
    },
    {
      category: "Математика",
      question: "Яка площа квадрата зі стороною 5 см?",
      answers: ["10 см²", "20 см²", "25 см²", "30 см²"],
      correct: [2]
    },
    {
      category: "Математика",
      question: "Скільки буде 2³?",
      answers: ["6", "8", "9", "12"],
      correct: [1]
    },
    {
      category: "Математика",
      question: "Який результат має вираз (15 ÷ 3) + 4?",
      answers: ["10", "9", "8", "7"],
      correct: [1]
    }
  );

  localStorage.setItem('quizQuestions', JSON.stringify(questions));
}
