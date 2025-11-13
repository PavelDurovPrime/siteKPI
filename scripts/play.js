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

// =========================================================================
// === ФУНКЦІОНАЛ ДЛЯ СТОРІНКИ КЕРУВАННЯ (manage.html) ===
// =========================================================================

/**
 * Відображає список усіх тестів (питань) на сторінці manage.html.
 * Прив'язує обробники для видалення та проходження.
 */
function renderManagementList() {
    // Використовуємо існуючий ключ для питань
    const quizzes = JSON.parse(localStorage.getItem('quizQuestions')) || [];
    const quizListElement = document.getElementById('quiz-list');
    const noQuizzesMessage = document.getElementById('no-quizzes-message');
    
    // Очищаємо попередній вміст
    if (!quizListElement) return; // Захист, якщо елемент не знайдено на сторінці
    quizListElement.innerHTML = ''; 

    if (quizzes.length === 0) {
        if (noQuizzesMessage) noQuizzesMessage.style.display = 'block';
        return;
    }
    
    if (noQuizzesMessage) noQuizzesMessage.style.display = 'none';

    // Для керування використовуємо унікальний ідентифікатор.
    // Оскільки у ваших питаннях немає ID, ми будемо використовувати ІНДЕКС у масиві.
    
    // Групуємо питання за категоріями для зручності відображення, 
    // оскільки ваш поточний код використовує категорії як тести.
    const categories = quizzes.reduce((acc, q) => {
        const cat = q.category || 'Без категорії';
        if (!acc[cat]) {
            acc[cat] = { name: cat, count: 0 };
        }
        acc[cat].count++;
        return acc;
    }, {});
    
    // Відображаємо список категорій/тестів
    Object.values(categories).forEach((catInfo) => {
        const listItem = document.createElement('li');
        listItem.className = 'quiz-manage-item';
        
        // Для спрощення, тут керуємо тестами на рівні КАТЕГОРІЙ.
        // Оскільки в play.js ви використовуєте category для startQuiz.
        const categoryNameEncoded = encodeURIComponent(catInfo.name);
        
        listItem.innerHTML = `
            <h3>Тест: ${catInfo.name}</h3>
            <p>Кількість питань: ${catInfo.count}</p>
            <div class="actions">
                
                <button 
                    onclick="startQuiz('${catInfo.name}')" 
                    class="button-small play-btn"
                >
                    Пройти
                </button>
                
                <button 
                    class="button-small delete-btn" 
                    data-quiz-name="${catInfo.name}"
                >
                    🗑️ Видалити Тест
                </button>
            </div>
        `;
        
        quizListElement.appendChild(listItem);
    });
    
    // Додаємо обробники подій для кнопок "Видалити"
    document.querySelectorAll('.delete-btn').forEach(button => {
        button.addEventListener('click', (event) => {
            const quizName = event.target.dataset.quizName;
            deleteQuizCategory(quizName);
        });
    });
}

/**
 * Видаляє всі питання, що належать до певної категорії/тесту.
 * @param {string} categoryName - Назва категорії для видалення.
 */
function deleteQuizCategory(categoryName) {
    if (!confirm(`Ви впевнені, що хочете видалити ТЕСТ "${categoryName}" та всі його питання? Цю дію не можна скасувати.`)) {
        return;
    }

    const quizzes = JSON.parse(localStorage.getItem('quizQuestions')) || [];
    
    // Створюємо новий масив без питань цієї категорії
    const updatedQuizzes = quizzes.filter(quiz => quiz.category !== categoryName); 
    
    // Зберігаємо оновлений масив у сховищі
    localStorage.setItem('quizQuestions', JSON.stringify(updatedQuizzes));
    
    // Перемальовуємо список
    renderManagementList(); 
    alert(`Тест "${categoryName}" та його питання успішно видалено.`);
}


// Ініціалізація: викликаємо renderManagementList, тільки якщо ми на сторінці manage.html
// (для цього потрібно, щоб на цій сторінці був елемент з ID 'quiz-list')
document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('quiz-list')) {
        renderManagementList();
    }
});