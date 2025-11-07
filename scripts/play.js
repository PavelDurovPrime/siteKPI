function showPage(pageId) {
  document.querySelectorAll('.page').forEach(page => page.classList.remove('active'));
  document.getElementById(pageId).classList.add('active');
}

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




function startQuiz() {
  const quizContainer = document.getElementById('quizContainer');
  const result = document.getElementById('result');
  quizContainer.innerHTML = '';
  result.innerHTML = '';

  const questions = JSON.parse(localStorage.getItem('quizQuestions')) || [];
  if (questions.length === 0) {
    quizContainer.innerHTML = '<p>Немає питань!</p>';
    return;
  }

  questions.forEach((q, index) => {
    const div = document.createElement('div');
    div.innerHTML = `<p>${index + 1}. ${q.question}</p>`;
    q.answers.forEach((ans, i) => {
      div.innerHTML += `<div><label><input type="checkbox" name="q${index}" value="${i}"> ${ans}</label></div>`;
    });
    quizContainer.appendChild(div);
  });

  const btn = document.createElement('button');
  btn.textContent = 'Перевірити результати';
  btn.onclick = () => checkResults(questions);
  quizContainer.appendChild(btn);
}

function checkResults(questions) {
  let score = 0;
  questions.forEach((q, index) => {
    const selected = Array.from(document.querySelectorAll(`input[name='q${index}']:checked`)).map(el => parseInt(el.value));
    if (JSON.stringify(selected.sort()) === JSON.stringify(q.correct.sort())) score++;
  });

  const percent = ((score / questions.length) * 100).toFixed(2);
  document.getElementById('result').innerHTML = `Правильних відповідей: ${score} із ${questions.length} (${percent}%)`;
}