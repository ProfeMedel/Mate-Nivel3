// Aventuras Matemáticas - Operaciones Básicas
// Categorías: Todos, Sumar/Restar, Multiplicar, Dividir.
// Límite: 15 preguntas por categoría (30 en "Todos"). Se termina a los 4 errores.

const $ = (id) => document.getElementById(id);

const CATEGORY_NAMES = {
  all: "Todos", 
  addsub: "Sumar/Restar", 
  mult: "Multiplicar", 
  division: "Dividir"
};

const COLORS = [
  "bg-red-500 hover:bg-red-600 border-red-700",
  "bg-blue-500 hover:bg-blue-600 border-blue-700",
  "bg-emerald-500 hover:bg-emerald-600 border-emerald-700",
  "bg-amber-500 hover:bg-amber-600 border-amber-700",
  "bg-purple-500 hover:bg-purple-600 border-purple-700"
];

const CAT_ACTIVE_CLASS = "cat-btn bg-purple-600 text-white font-bold py-3 px-3 rounded-2xl text-sm shadow border-b-4 border-purple-800 transition-all flex items-center justify-center gap-2";
const CAT_INACTIVE_CLASS = "cat-btn bg-white hover:bg-purple-50 text-slate-700 font-bold py-3 px-3 rounded-2xl text-sm shadow border-b-4 border-slate-300 transition-all flex items-center justify-center gap-2";

let playerName = "";
let currentCategory = "all";
let questions = [];
let questionIndex = 0;
let errors = 0;
let categoryScore = 0;
let totalScore = 0;
let answerLocked = false;
let currentQuestion = null;

// Exclusivamente preguntas de operaciones básicas
const fixedQuestions = [
  {category:"addsub", topic:"Adición", question:"¿Cuánto es 350 + 240?", correct:590},
  {category:"addsub", topic:"Sustracción", question:"¿Cuánto es 800 - 260?", correct:540},
  {category:"addsub", topic:"Adición", question:"¿Cuánto es 420 + 180?", correct:600},
  {category:"addsub", topic:"Sustracción", question:"¿Cuánto es 950 - 320?", correct:630},
  {category:"mult", topic:"Tabla del 5", question:"¿Cuánto es 5 × 6?", correct:30},
  {category:"mult", topic:"Multiplicación", question:"¿Cuánto es 7 × 8?", correct:56},
  {category:"mult", topic:"Tabla del 9", question:"¿Cuánto es 9 × 4?", correct:36},
  {category:"mult", topic:"Multiplicación", question:"¿Cuánto es 6 × 7?", correct:42},
  {category:"division", topic:"División básica", question:"¿Cuánto es 15 ÷ 5?", correct:3},
  {category:"division", topic:"División exacta", question:"¿Cuánto es 24 ÷ 6?", correct:4},
  {category:"division", topic:"División exacta", question:"¿Cuánto es 36 ÷ 9?", correct:4},
  {category:"division", topic:"División exacta", question:"¿Cuánto es 40 ÷ 8?", correct:5}
];

function shuffle(array) {
  const copy = [...array];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function makeOptions(correct, mode = "near") {
  const result = new Set([correct]);
  let attempts = 0;
  while (result.size < 5 && attempts < 500) {
    attempts++;
    let delta;
    if (mode === "small") delta = Math.floor(Math.random() * 7) - 3;
    else if (mode === "mult") delta = (Math.floor(Math.random() * 9) - 4) * 2;
    else delta = (Math.floor(Math.random() * 9) - 4) * 10;
    
    if (delta === 0) delta = 7;
    const candidate = correct + delta;
    if (candidate !== correct && candidate > 0) result.add(candidate);
  }
  
  let n = 1;
  while (result.size < 5) {
    result.add(correct + n * 11);
    n++;
  }
  return shuffle([...result]);
}

function makeDynamicQuestion(category) {
  const activeCat = category === "all"
    ? ["addsub", "mult", "division"][Math.floor(Math.random() * 3)]
    : category;

  if (activeCat === "addsub") {
    const subtract = Math.random() < 0.5;
    const a = Math.floor(Math.random() * 700) + 100;
    const b = Math.floor(Math.random() * Math.min(700, a - 1)) + 10;
    const x = subtract ? Math.max(a, b) : a;
    const y = subtract ? Math.min(a, b) : b;
    const correct = subtract ? x - y : a + b;
    return {
      category: activeCat,
      topic: subtract ? "Sustracción" : "Adición",
      question: subtract ? `¿Cuánto es ${x} - ${y}?` : `¿Cuánto es ${a} + ${b}?`,
      correct,
      options: makeOptions(correct)
    };
  }

  if (activeCat === "mult") {
    const a = Math.floor(Math.random() * 10) + 2;
    const b = Math.floor(Math.random() * 10) + 2;
    const correct = a * b;
    return {
      category: activeCat,
      topic: "Multiplicación",
      question: `¿Cuánto es ${a} × ${b}?`,
      correct,
      options: makeOptions(correct, "mult")
    };
  }

  // Generador para división
  const divisor = Math.floor(Math.random() * 8) + 2;
  const cociente = Math.floor(Math.random() * 9) + 2;
  const dividendo = divisor * cociente;
  return {
    category: activeCat,
    topic: "División exacta",
    question: `¿Cuánto es ${dividendo} ÷ ${divisor}?`,
    correct: cociente,
    options: makeOptions(cociente, "small")
  };
}

function prepareQuestion(q) {
  const copy = JSON.parse(JSON.stringify(q));
  if (!copy.options) copy.options = makeOptions(copy.correct);
  return copy;
}

function buildQuestionPool(category, count) {
  const pool = [];
  const seen = new Set();
  const matching = fixedQuestions.filter(q => category === "all" || q.category === category);

  for (const item of matching) {
    const q = prepareQuestion(item);
    if (!seen.has(q.question)) {
      seen.add(q.question);
      pool.push(q);
    }
  }

  let attempts = 0;
  const maxAttempts = count * 300;
  while (pool.length < count && attempts < maxAttempts) {
    attempts++;
    const q = prepareQuestion(makeDynamicQuestion(category));
    if (!seen.has(q.question)) {
      seen.add(q.question);
      pool.push(q);
    }
  }

  let variant = 1;
  while (pool.length < count) {
    const q = prepareQuestion(makeDynamicQuestion(category));
    q.question = `${q.question} (${variant})`;
    if (!seen.has(q.question)) {
      seen.add(q.question);
      pool.push(q);
    }
    variant++;
  }

  return shuffle(pool).slice(0, count);
}

function startRound(category, resetScore = false) {
  currentCategory = category;
  if (resetScore) {
    categoryScore = 0;
    totalScore = 0;
  }
  questionIndex = 0;
  errors = 0;
  answerLocked = false;
  const amount = category === "all" ? 30 : 15;
  questions = buildQuestionPool(category, amount);
  
  $("score-display").textContent = totalScore;
  $("start-screen").classList.add("hidden");
  $("summary-modal").classList.add("hidden");
  $("game-screen").classList.remove("hidden");
  $("restart-button").classList.remove("hidden");
  
  updateCategoryButtons();
  renderQuestion();
}

function updateCategoryButtons() {
  document.querySelectorAll(".cat-btn").forEach(btn => {
    const active = btn.dataset.category === currentCategory;
    btn.className = active ? CAT_ACTIVE_CLASS : CAT_INACTIVE_CLASS;
  });
}

function renderQuestion() {
  if (questionIndex >= questions.length) return finishGame(errors < 4);
  currentQuestion = questions[questionIndex];
  answerLocked = false;
  
  $("round-progress").textContent = `${questionIndex + 1}/${questions.length}`;
  $("progress-bar").style.width = `${(questionIndex / questions.length) * 100}%`;
  $("topic-tag").textContent = currentQuestion.topic;
  $("question-text").textContent = currentQuestion.question;
  $("feedback-box").textContent = "¡Elige la respuesta correcta!";
  $("feedback-box").className = "h-12 flex items-center justify-center text-center text-xl font-extrabold text-purple-600 animate-pulse";
  
  // Icono dinámico según la operación
  let icon = 'fa-calculator';
  if (currentQuestion.topic.includes("Adición")) icon = 'fa-plus';
  else if (currentQuestion.topic.includes("Sustracción")) icon = 'fa-minus';
  else if (currentQuestion.topic.includes("Multiplicación") || currentQuestion.topic.includes("Tabla")) icon = 'fa-xmark';
  else if (currentQuestion.topic.includes("División")) icon = 'fa-divide';

  $("visual-container").innerHTML = `<div class="text-6xl text-purple-500"><i class="fa-solid ${icon}"></i></div>`;
  
  const container = $("options-container");
  container.innerHTML = "";
  
  shuffle(currentQuestion.options).forEach((option, index) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = `${COLORS[index]} answer-btn border-b-4 text-white font-extrabold text-2xl py-3 px-2 rounded-2xl shadow-lg bounce-hover`;
    button.textContent = option;
    button.addEventListener("click", () => checkAnswer(option, button));
    container.appendChild(button);
  });
  
  $("question-card").classList.remove("pop-in");
  void $("question-card").offsetWidth;
  $("question-card").classList.add("pop-in");
}

function checkAnswer(selected, button) {
  if (answerLocked) return;
  
  if (selected === currentQuestion.correct || String(selected) === String(currentQuestion.correct)) {
    answerLocked = true;
    categoryScore += 10;
    totalScore += 10;
    $("score-display").textContent = totalScore;
    $("feedback-box").textContent = "¡Excelente! ¡Respuesta correcta!";
    $("feedback-box").className = "h-12 flex items-center justify-center text-center text-xl font-extrabold text-emerald-600";
    button.classList.add("ring-4", "ring-yellow-300");
    if (window.confetti) confetti({particleCount:45, spread:55, origin:{y:.7}});
    
    window.setTimeout(() => {
      questionIndex++;
      renderQuestion();
    }, 650);
  } else {
    answerLocked = true;
    errors++;
    $("feedback-box").textContent = errors >= 4 ? "¡Has acumulado 4 errores!" : "Respuesta incorrecta. Pasando a la siguiente...";
    $("feedback-box").className = "h-12 flex items-center justify-center text-center text-lg font-extrabold text-rose-600";
    button.classList.add("opacity-50", "ring-4", "ring-rose-300");
    $("question-card").classList.add("shake");
    
    window.setTimeout(() => {
      $("question-card").classList.remove("shake");
      if (errors >= 4) {
        finishGame(false);
      } else {
        questionIndex++;
        renderQuestion();
      }
    }, 850);
  }
}

function finishGame(won) {
  $("game-screen").classList.add("hidden");
  $("summary-modal").classList.remove("hidden");
  $("progress-bar").style.width = won ? "100%" : `${(questionIndex / questions.length) * 100}%`;
  $("modal-score").textContent = categoryScore;
  $("modal-trophy-icon").innerHTML = won ? '<i class="fa-solid fa-trophy"></i>' : '<i class="fa-solid fa-heart-crack text-rose-500"></i>';
  
  if (won) {
    $("modal-title").textContent = "¡Ronda Completada!";
    $("modal-subtitle").textContent = `¡Excelente trabajo, ${playerName}!`;
    $("modal-feedback").textContent = "¡Eres un/a genio/a del cálculo mental!";
    if (window.confetti) confetti({particleCount:150, spread:100, origin:{y:.6}});
  } else {
    $("modal-title").textContent = "¡Game Over!";
    $("modal-subtitle").textContent = `¡Ánimo, ${playerName}! Cometiste 4 errores.`;
    $("modal-feedback").textContent = "¡Sigue practicando para mejorar!";
  }
}

// Event Listeners
$("start-form").addEventListener("submit", (event) => {
  event.preventDefault();
  playerName = $("player-name").value.trim();
  if (!playerName) return;
  startRound("all", true);
});

$("category-selector").addEventListener("click", (event) => {
  const button = event.target.closest("[data-category]");
  if (!button) return;
  const category = button.dataset.category;
  startRound(category, category !== currentCategory);
});

$("play-again").addEventListener("click", () => startRound(currentCategory, false));
$("restart-button").addEventListener("click", () => startRound(currentCategory, false));

$("btn-speak").addEventListener("click", () => {
  if (!("speechSynthesis" in window) || !currentQuestion) return;
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(currentQuestion.question);
  utterance.lang = "es-CL";
  utterance.rate = 0.85;
  window.speechSynthesis.speak(utterance);
});
