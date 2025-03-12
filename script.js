let quizData = [];
let currentQuestionIndex = 0;
let score = 0;
let selected = false;

const questionNumberEl = document.getElementById("question-number");
const questionEl = document.getElementById("question");
const optionsEl = document.getElementById("options");
const feedbackEl = document.getElementById("feedback");
const resultEl = document.getElementById("result");
const nextButton = document.getElementById("next-button");
const resetButton = document.getElementById("reset-button");

async function fetchQuizData() {
  try {
    const response = await fetch(
      "https://opentdb.com/api.php?amount=10&category=21&difficulty=easy&type=multiple"
    );

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();

    if (!data.results || data.results.length === 0) {
      throw new Error("No quiz data available.");
    }

    quizData = data.results.map((item) => ({
      question: item.question,
      options: [...item.incorrect_answers, item.correct_answer].sort(
        () => Math.random() - 0.5
      ),
      answer: item.correct_answer,
    }));

    loadQuestion();
  } catch (error) {
    questionEl.textContent = `Error: ${error.message}`;
    console.error("Error fetching quiz data:", error);
  }
}

function loadQuestion() {
  selected = false;
  nextButton.style.display = "none";
  optionsEl.innerHTML = "";
  feedbackEl.textContent = "";
  resultEl.textContent = "";
  feedbackEl.className = "";

  if (currentQuestionIndex < quizData.length) {
    const currentQuestion = quizData[currentQuestionIndex];
    questionNumberEl.textContent = `Question ${currentQuestionIndex + 1}`;
    questionEl.innerHTML = currentQuestion.question;
    currentQuestion.options.forEach((option) => {
      const li = document.createElement("li");
      li.textContent = option;
      li.onclick = () => checkAnswer(li, option);
      optionsEl.appendChild(li);
    });
  } else {
    questionNumberEl.textContent = "";
    questionEl.textContent = `Quiz completed! Your score: ${score}/${quizData.length}`;
    optionsEl.innerHTML = "";
  }
}

function checkAnswer(li, selectedOption) {
  if (selected) return;
  selected = true;
  nextButton.style.display = "inline-block";
  const correctAnswer = quizData[currentQuestionIndex].answer;

  if (selectedOption === correctAnswer) {
    li.classList.add("correct");
    score++;
    feedbackEl.textContent = "Correct!";
    feedbackEl.classList.add("feedback-correct");
  } else {
    li.classList.add("wrong");
    feedbackEl.textContent = "incorrect!";
    feedbackEl.classList.add("feedback-wrong");
  }

  const options = document.querySelectorAll("#options li");
  options.forEach((option) => (option.onclick = null));
}

function nextQuestion() {
  currentQuestionIndex++;
  loadQuestion();
}

function resetQuiz() {
  currentQuestionIndex = 0;
  score = 0;
  fetchQuizData();
}

nextButton.addEventListener("click", nextQuestion);
resetButton.addEventListener("click", resetQuiz);

fetchQuizData();
