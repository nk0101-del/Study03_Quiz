// 2026-10-08 15:56 KST
// 상식 퀴즈 앱. 구조는 PRD.md 5절을 따른다.

// ---------- 자체 점검 틀 ----------

const SELF_TESTS = [];

function check(name, fn) {
  SELF_TESTS.push({ name, fn });
}

function assertEqual(actual, expected, label) {
  const a = JSON.stringify(actual);
  const e = JSON.stringify(expected);
  if (a !== e) throw new Error(`${label ? label + " " : ""}기댓값 ${e}, 실제값 ${a}`);
}

function runSelfTest() {
  const failures = [];
  for (const t of SELF_TESTS) {
    try {
      t.fn();
    } catch (err) {
      failures.push(`${t.name}: ${err.message}`);
    }
  }
  const total = SELF_TESTS.length;
  const passed = total - failures.length;
  return { total, passed, failures, summary: `자체 점검: ${total}개 중 ${passed}개 통과` };
}

// ---------- 상수 ----------

const CATEGORIES = ["한국사", "세계지리", "과학", "예술과 문화"];
const CATEGORY_IDS = { "한국사": "korhist", "세계지리": "geo", "과학": "sci", "예술과 문화": "art" };
const QUESTIONS_PER_GAME = 10;

// ---------- 문항 처리 (순수 함수) ----------

// 피셔-예이츠 방식으로 섞은 새 배열을 돌려준다.
function shuffle(array, rand = Math.random) {
  const result = [...array];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

// 보기를 섞고, 섞인 보기에서 정답의 위치를 다시 찾는다.
function prepareQuestion(question, rand = Math.random) {
  const order = shuffle([0, 1, 2, 3], rand);
  return {
    ...question,
    choices: order.map(i => question.choices[i]),
    answer: order.indexOf(question.answer)
  };
}

function scoreFor(correct, hintUsed) {
  if (!correct) return 0;
  return hintUsed ? 0.5 : 1;
}

function formatScore(score, total) {
  return `${score} / ${total}`;
}

function isFilled(text) {
  return typeof text === "string" && text.trim() !== "";
}

function validateQuestions(list) {
  const errors = [];
  for (const q of list) {
    const id = q.id || "(id 없음)";
    if (!CATEGORIES.includes(q.category)) errors.push(`${id}: 카테고리 "${q.category}"는 없는 카테고리입니다.`);
    if (!isFilled(q.question)) errors.push(`${id}: 문제가 비어 있습니다.`);
    const choices = Array.isArray(q.choices) ? q.choices : [];
    if (choices.length !== 4 || new Set(choices).size !== 4 || !choices.every(isFilled)) {
      errors.push(`${id}: 보기는 서로 다른 4개여야 합니다.`);
    }
    if (!Number.isInteger(q.answer) || q.answer < 0 || q.answer > 3) errors.push(`${id}: 정답 위치는 0~3이어야 합니다.`);
    if (!isFilled(q.explanation)) errors.push(`${id}: 해설이 비어 있습니다.`);
    if (!q.source || !isFilled(q.source.name) || !isFilled(q.source.url)) errors.push(`${id}: 출처 이름과 주소가 있어야 합니다.`);
  }
  const ids = list.map(q => q.id);
  for (const id of new Set(ids.filter((id, i) => ids.indexOf(id) !== i))) {
    errors.push(`${id}: id가 중복됩니다.`);
  }
  for (const category of CATEGORIES) {
    const count = list.filter(q => q.category === category).length;
    if (count !== QUESTIONS_PER_GAME) errors.push(`${category} 문항이 ${count}개입니다. ${QUESTIONS_PER_GAME}개여야 합니다.`);
  }
  return errors;
}

// ---------- 게임 진행 (순수 함수, 인수를 바꾸지 않고 새 객체를 돌려줌) ----------

function questionsOf(category, all = QUESTIONS) {
  return all.filter(q => q.category === category);
}

function createGame(mode, category, questions, rand = Math.random, isRetry = false) {
  return {
    mode,
    category,
    items: shuffle(questions, rand).map(q => prepareQuestion(q, rand)),
    index: 0,
    score: 0,
    correctCount: 0,
    wrongIds: [],
    answered: false,
    hintUsed: false,
    removed: [],
    lastResult: null,
    isRetry
  };
}

// choiceIndex가 null이면 시간 초과다.
function applyAnswer(game, choiceIndex) {
  if (game.answered) return game;
  const item = game.items[game.index];
  const correct = choiceIndex === item.answer;
  return {
    ...game,
    answered: true,
    score: game.score + scoreFor(correct, game.hintUsed),
    correctCount: game.correctCount + (correct ? 1 : 0),
    wrongIds: correct ? game.wrongIds : [...game.wrongIds, item.id],
    lastResult: { correct, choice: choiceIndex, timedOut: choiceIndex === null }
  };
}

function nextQuestion(game) {
  return { ...game, index: game.index + 1, answered: false, hintUsed: false, removed: [], lastResult: null };
}

function isLastQuestion(game) {
  return game.index === game.items.length - 1;
}

// ---------- 화면 ----------

function showScreen(id) {
  for (const section of document.querySelectorAll("main > section")) {
    section.hidden = section.id !== id;
  }
}

function showSelfTest() {
  const result = runSelfTest();
  const box = document.getElementById("selftest");
  box.textContent = [result.summary, ...result.failures].join("\n");
  box.className = result.failures.length ? "fail" : "pass";
  box.hidden = false;
  console.log(result.summary);
  result.failures.forEach(f => console.error(`실패: ${f}`));
}

const $ = id => document.getElementById(id);
const choiceButtons = () => [...document.querySelectorAll("#choices .choice")];

const state = { game: null, firstGame: null };

function startGame(mode, category) {
  state.game = createGame(mode, category, questionsOf(category));
  state.firstGame = state.game;
  showScreen("screen-quiz");
  renderQuestion();
}

function renderQuestion() {
  const g = state.game;
  const item = g.items[g.index];
  $("quiz-meta").textContent = `${g.category}, 연습 모드`;
  $("quiz-progress").textContent = `${g.index + 1} / ${g.items.length}`;
  $("quiz-score").textContent = `점수 ${g.score}`;
  $("quiz-question").textContent = item.question;
  choiceButtons().forEach((button, i) => {
    button.textContent = item.choices[i];
    button.className = "choice";
    button.disabled = false;
  });
  $("feedback").hidden = true;
  $("btn-next").hidden = true;
}

function selectChoice(index) {
  const before = state.game;
  state.game = applyAnswer(state.game, index);
  if (state.game !== before) showFeedback();
}

function showFeedback() {
  const g = state.game;
  const item = g.items[g.index];
  const result = g.lastResult;
  choiceButtons().forEach((button, i) => {
    button.disabled = true;
    if (i === item.answer) button.classList.add("correct");
    else if (i === result.choice) button.classList.add("wrong");
  });
  $("quiz-score").textContent = `점수 ${g.score}`;
  $("feedback-verdict").textContent = result.correct ? "정답입니다." : "오답입니다.";
  $("feedback-verdict").className = result.correct ? "verdict-correct" : "verdict-wrong";
  $("feedback-explanation").textContent = item.explanation;
  $("feedback-source").textContent = `출처: ${item.source.name}`;
  $("feedback-source").href = item.source.url;
  $("feedback").hidden = false;
  $("btn-next").textContent = isLastQuestion(g) ? "결과 보기" : "다음";
  $("btn-next").hidden = false;
}

function handleNext() {
  if (isLastQuestion(state.game)) {
    if (!state.game.isRetry) state.firstGame = state.game;
    showResult();
    return;
  }
  state.game = nextQuestion(state.game);
  renderQuestion();
}

function showResult() {
  showScreen("screen-result");
}

function init() {
  if (new URLSearchParams(location.search).has("test")) showSelfTest();
  for (const button of document.querySelectorAll("[data-category]")) {
    button.addEventListener("click", () => startGame("practice", button.dataset.category));
  }
  choiceButtons().forEach((button, i) => button.addEventListener("click", () => selectChoice(i)));
  $("btn-next").addEventListener("click", handleNext);
  showScreen("screen-start");
}

// ---------- 점검 항목 ----------

check("자체 점검 틀이 동작함", () => assertEqual(typeof runSelfTest, "function"));

// 규칙에 맞는 가짜 문항(점검용)
function makeQuestion(category, n) {
  return {
    id: `${CATEGORY_IDS[category]}-${String(n).padStart(2, "0")}`,
    category,
    question: `문제 ${n}`,
    choices: ["가", "나", "다", "라"],
    answer: 0,
    explanation: "해설",
    source: { name: "출처", url: "https://example.org" }
  };
}

function makeFullSet() {
  return CATEGORIES.flatMap(c => Array.from({ length: QUESTIONS_PER_GAME }, (_, i) => makeQuestion(c, i + 1)));
}

function expectError(label, modify, text) {
  check(`validateQuestions: ${label}`, () => {
    const set = makeFullSet();
    modify(set);
    const errors = validateQuestions(set);
    assertEqual(errors.some(e => e.includes(text)), true, `"${text}"이 든 오류 (오류: ${JSON.stringify(errors)})`);
  });
}

check("shuffle: 정해진 난수로 정해진 순서", () => assertEqual(shuffle([1, 2, 3, 4], () => 0), [2, 3, 4, 1]));
check("shuffle: 원본을 바꾸지 않음", () => {
  const a = [1, 2, 3, 4];
  shuffle(a);
  assertEqual(a, [1, 2, 3, 4]);
});
check("prepareQuestion: 섞인 보기에서도 정답이 같음", () => {
  const q = { ...makeQuestion("한국사", 1), choices: ["가", "나", "다", "라"], answer: 1 };
  const p = prepareQuestion(q, () => 0);
  assertEqual(p.choices, ["나", "다", "라", "가"]);
  assertEqual(p.choices[p.answer], "나");
  assertEqual(q.choices, ["가", "나", "다", "라"]);
});
check("scoreFor: 맞힘 1, 힌트 맞힘 0.5, 틀림 0", () => {
  assertEqual([scoreFor(true, false), scoreFor(true, true), scoreFor(false, false), scoreFor(false, true)], [1, 0.5, 0, 0]);
});
check("formatScore", () => assertEqual([formatScore(7, 10), formatScore(7.5, 10), formatScore(0, 10)], ["7 / 10", "7.5 / 10", "0 / 10"]));
check("validateQuestions: 올바른 40개는 오류 없음", () => assertEqual(validateQuestions(makeFullSet()), []));
expectError("보기가 3개", set => { set[0].choices = ["가", "나", "다"]; }, "korhist-01");
expectError("보기가 겹침", set => { set[0].choices = ["가", "가", "다", "라"]; }, "korhist-01");
expectError("정답 위치가 범위 밖", set => { set[0].answer = 4; }, "korhist-01");
expectError("해설이 비어 있음", set => { set[0].explanation = ""; }, "korhist-01");
expectError("출처 주소가 비어 있음", set => { set[0].source.url = ""; }, "korhist-01");
expectError("없는 카테고리", set => { set[0].category = "수학"; }, "korhist-01");
expectError("id 중복", set => { set[1].id = "korhist-01"; }, "중복");
expectError("카테고리 문항 수 부족", set => { set.splice(set.findIndex(q => q.category === "세계지리"), 1); }, "세계지리");

function checkCategory(category) {
  check(`${category} 문항 10개가 규칙에 맞음`, () => {
    const list = QUESTIONS.filter(q => q.category === category);
    assertEqual(list.length, 10);
    assertEqual(validateQuestions(list).filter(e => !e.includes("문항이")), []);
  });
}

checkCategory("한국사");
checkCategory("세계지리");
checkCategory("과학");
checkCategory("예술과 문화");
check("문항 40개 전체가 규칙에 맞음", () => assertEqual(validateQuestions(QUESTIONS), []));

const sciSet = () => makeFullSet().filter(q => q.category === "과학");
check("createGame: 그 카테고리의 10문제로 시작", () => {
  const g = createGame("practice", "과학", sciSet(), () => 0);
  assertEqual([g.items.length, g.index, g.score, g.answered], [10, 0, 0, false]);
  assertEqual(g.items.every(q => q.category === "과학"), true);
});
check("applyAnswer: 맞히면 1점, 결과 기록", () => {
  const g = createGame("practice", "과학", sciSet());
  const a = applyAnswer(g, g.items[0].answer);
  assertEqual([a.score, a.correctCount, a.answered, a.wrongIds], [1, 1, true, []]);
  assertEqual(a.lastResult, { correct: true, choice: g.items[0].answer, timedOut: false });
  assertEqual(g.score, 0);
});
check("applyAnswer: 틀리면 0점, 틀린 id 기록", () => {
  const g = createGame("practice", "과학", sciSet());
  const a = applyAnswer(g, (g.items[0].answer + 1) % 4);
  assertEqual([a.score, a.wrongIds], [0, [g.items[0].id]]);
});
check("applyAnswer: 시간 초과(null)는 오답", () => {
  const g = createGame("speed", "과학", sciSet());
  const a = applyAnswer(g, null);
  assertEqual([a.score, a.lastResult.timedOut, a.lastResult.correct, a.wrongIds.length], [0, true, false, 1]);
});
check("applyAnswer: 이미 답한 문항은 다시 채점하지 않음", () => {
  const g = createGame("speed", "과학", sciSet());
  const a = applyAnswer(g, g.items[0].answer);
  assertEqual(applyAnswer(a, null) === a, true);
});
check("nextQuestion과 isLastQuestion", () => {
  let g = createGame("practice", "과학", sciSet());
  g = nextQuestion(applyAnswer(g, 0));
  assertEqual([g.index, g.answered, g.lastResult], [1, false, null]);
  for (let i = 1; i < 9; i++) g = nextQuestion(applyAnswer(g, 0));
  assertEqual([g.index, isLastQuestion(g)], [9, true]);
});

if (typeof document !== "undefined") init();
