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
const MODES = { practice: "연습", speed: "스피드", hint: "힌트" };
const TIME_LIMIT = 15;

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
    results: [],
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
    lastResult: { correct, choice: choiceIndex, timedOut: choiceIndex === null },
    results: [...game.results, {
      id: item.id,
      question: item.question,
      answerText: item.choices[item.answer],
      correct,
      timedOut: choiceIndex === null,
      hintUsed: game.hintUsed
    }]
  };
}

// 결과 화면의 문항별 한 줄. 맞힌 문항은 정답을 다시 적지 않는다.
function formatResultLine(result) {
  if (result.correct) return result.hintUsed ? "정답 (힌트 0.5점)" : "정답";
  return `${result.timedOut ? "시간 초과" : "오답"}, 정답: ${result.answerText}`;
}

function nextQuestion(game) {
  return { ...game, index: game.index + 1, answered: false, hintUsed: false, removed: [], lastResult: null };
}

function isLastQuestion(game) {
  return game.index === game.items.length - 1;
}

function createRetry(game, all = QUESTIONS, rand = Math.random) {
  const wrong = all.filter(q => game.wrongIds.includes(q.id));
  return createGame("practice", game.category, wrong, rand, true);
}

function formatRetrySummary(correctCount, total) {
  return `${total}문제 중 ${correctCount}문제 맞힘`;
}

// 다시 풀기는 점수를 매기지 않으므로 점수 대신 "채점 안 함"을 보인다.
function quizMetaLabel(game) {
  return `${game.category}, ${MODES[game.mode]} 모드${game.isRetry ? ", 다시 풀기" : ""}`;
}

function scoreLabel(game) {
  return game.isRetry ? "채점 안 함" : `점수 ${game.score}`;
}

// 현재 문항의 오답 보기 가운데 2개의 위치를 removed에 넣는다.
function applyHint(game, rand = Math.random) {
  if (game.mode !== "hint" || game.hintUsed || game.answered) return game;
  const item = game.items[game.index];
  const wrong = [0, 1, 2, 3].filter(i => i !== item.answer);
  return { ...game, hintUsed: true, removed: shuffle(wrong, rand).slice(0, 2) };
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

const state = { game: null, firstGame: null, category: null, timerId: null, timeLeft: 0 };

function chooseCategory(category) {
  state.category = category;
  $("mode-title").textContent = `${category}, 모드를 고르세요`;
  showScreen("screen-mode");
}

function startGame(mode, category) {
  state.game = createGame(mode, category, questionsOf(category));
  state.firstGame = state.game;
  showScreen("screen-quiz");
  renderQuestion();
}

function renderQuestion() {
  const g = state.game;
  const item = g.items[g.index];
  $("quiz-meta").textContent = quizMetaLabel(g);
  $("quiz-progress").textContent = `${g.index + 1} / ${g.items.length}`;
  $("quiz-score").textContent = scoreLabel(g);
  $("quiz-question").textContent = item.question;
  choiceButtons().forEach((button, i) => {
    button.textContent = item.choices[i];
    button.className = "choice";
    button.disabled = false;
  });
  $("feedback").hidden = true;
  $("btn-next").hidden = true;
  $("btn-hint").hidden = g.mode !== "hint";
  $("btn-hint").disabled = false;
  $("btn-hint").textContent = "힌트 (오답 2개 지우기)";
  $("quiz-timer").hidden = g.mode !== "speed";
  if (g.mode === "speed") startTimer();
}

// 이전 타이머를 먼저 멈춰서 타이머가 겹쳐 돌지 않게 한다.
function startTimer() {
  stopTimer();
  state.timeLeft = TIME_LIMIT;
  renderTimer();
  state.timerId = setInterval(() => {
    state.timeLeft -= 1;
    renderTimer();
    if (state.timeLeft <= 0) onTimeout();
  }, 1000);
}

// 5초 이하에서는 빨간 글자로 보인다.
function renderTimer() {
  $("quiz-timer").textContent = `남은 시간 ${state.timeLeft}초`;
  $("quiz-timer").classList.toggle("urgent", state.timeLeft <= 5);
}

function stopTimer() {
  clearInterval(state.timerId);
  state.timerId = null;
}

function onTimeout() {
  stopTimer();
  const before = state.game;
  state.game = applyAnswer(state.game, null);
  if (state.game !== before) showFeedback();
}

// 지운 보기는 흐리게 남겨 두어 다른 보기의 위치가 바뀌지 않게 한다.
function useHint() {
  const before = state.game;
  state.game = applyHint(state.game);
  if (state.game === before) return;
  const buttons = choiceButtons();
  for (const i of state.game.removed) {
    buttons[i].classList.add("removed");
    buttons[i].disabled = true;
  }
  $("btn-hint").disabled = true;
  $("btn-hint").textContent = "힌트 사용함";
}

function selectChoice(index) {
  stopTimer();
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
  $("btn-hint").disabled = true;
  $("quiz-score").textContent = scoreLabel(g);
  $("feedback-verdict").textContent = result.correct ? "정답입니다." : result.timedOut ? "시간 초과입니다. 오답입니다." : "오답입니다.";
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
  stopTimer();
  const first = state.firstGame;
  $("result-title").textContent = `${first.category}, ${MODES[first.mode]} 모드 결과`;
  $("result-score").textContent = formatScore(first.score, first.items.length);
  $("result-note").hidden = first.mode !== "practice";
  // 점수는 처음 10문제의 결과만 보이고, 다시 풀기 결과는 따로 보인다.
  const g = state.game;
  $("retry-summary").hidden = !g.isRetry;
  $("retry-summary").textContent = formatRetrySummary(g.correctCount, g.items.length);
  $("retry-all-correct").hidden = !(g.isRetry && g.wrongIds.length === 0);
  $("btn-retry-wrong").hidden = !(g.mode === "practice" && g.wrongIds.length > 0);
  // 문항별 목록은 방금 푼 판(다시 풀기 중이면 다시 푼 문항)을 보인다.
  $("result-list").replaceChildren(...g.results.map(result => {
    const li = document.createElement("li");
    const question = document.createElement("div");
    question.textContent = result.question;
    const line = document.createElement("div");
    line.textContent = formatResultLine(result);
    line.className = result.correct ? "verdict-correct" : "verdict-wrong";
    li.append(question, line);
    return li;
  }));
  showScreen("screen-result");
}

function startRetry() {
  state.game = createRetry(state.game);
  showScreen("screen-quiz");
  renderQuestion();
}

function showDataErrors(errors) {
  const list = $("error-list");
  list.replaceChildren(...errors.map(text => {
    const li = document.createElement("li");
    li.textContent = text;
    return li;
  }));
  showScreen("screen-error");
}

function init() {
  if (new URLSearchParams(location.search).has("test")) showSelfTest();
  const errors = validateQuestions(QUESTIONS);
  if (errors.length) {
    showDataErrors(errors);
    return;
  }
  for (const button of document.querySelectorAll("[data-category]")) {
    button.addEventListener("click", () => chooseCategory(button.dataset.category));
  }
  for (const button of document.querySelectorAll("[data-mode]")) {
    button.addEventListener("click", () => startGame(button.dataset.mode, state.category));
  }
  $("btn-mode-back").addEventListener("click", () => showScreen("screen-start"));
  choiceButtons().forEach((button, i) => button.addEventListener("click", () => selectChoice(i)));
  $("btn-next").addEventListener("click", handleNext);
  $("btn-hint").addEventListener("click", useHint);
  $("btn-retry-wrong").addEventListener("click", startRetry);
  $("btn-again").addEventListener("click", () => startGame(state.firstGame.mode, state.firstGame.category));
  $("btn-home").addEventListener("click", () => {
    stopTimer();
    showScreen("screen-start");
  });
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

check("모드 3개의 표시 이름", () => assertEqual(MODES, { practice: "연습", speed: "스피드", hint: "힌트" }));
check("스피드 제한 시간은 15초", () => assertEqual(TIME_LIMIT, 15));

const hintGame = () => createGame("hint", "과학", sciSet());
check("applyHint: 오답 2개를 지우고 정답은 남김", () => {
  const g = hintGame();
  const h = applyHint(g);
  assertEqual([h.hintUsed, h.removed.length, new Set(h.removed).size], [true, 2, 2]);
  assertEqual(h.removed.includes(g.items[0].answer), false);
  assertEqual(g.hintUsed, false);
});
check("applyHint: 한 문항에 한 번만", () => {
  const h = applyHint(hintGame());
  assertEqual(applyHint(h) === h, true);
});
check("applyHint: 힌트 모드가 아니면 동작하지 않음", () => {
  const g = createGame("practice", "과학", sciSet());
  assertEqual(applyHint(g) === g, true);
});
check("applyHint: 답한 뒤에는 동작하지 않음", () => {
  const a = applyAnswer(hintGame(), 0);
  assertEqual(applyHint(a) === a, true);
});
check("힌트를 쓰고 맞히면 0.5점", () => {
  const h = applyHint(hintGame());
  assertEqual(applyAnswer(h, h.items[0].answer).score, 0.5);
});
check("다음 문항에서 힌트를 다시 쓸 수 있음", () => {
  const n = nextQuestion(applyAnswer(applyHint(hintGame()), 0));
  assertEqual([n.hintUsed, n.removed], [false, []]);
});

check("createRetry: 틀린 문항만 다시 섞어 냄", () => {
  const set = sciSet();
  let g = createGame("practice", "과학", set);
  for (let i = 0; i < 10; i++) {
    const wrong = i < 3;
    g = applyAnswer(g, wrong ? (g.items[i].answer + 1) % 4 : g.items[i].answer);
    if (i < 9) g = nextQuestion(g);
  }
  const r = createRetry(g, set);
  assertEqual([r.items.length, r.isRetry, r.mode, r.score], [3, true, "practice", 0]);
  assertEqual(r.items.map(q => q.id).sort(), [...g.wrongIds].sort());
});
check("formatRetrySummary", () => assertEqual(formatRetrySummary(2, 3), "3문제 중 2문제 맞힘"));
check("다시 풀기 중에는 채점 안 함으로 보임", () => {
  const g = applyAnswer(createGame("practice", "과학", sciSet()), 0);
  const r = applyAnswer(createGame("practice", "과학", sciSet(), Math.random, true), 0);
  assertEqual([quizMetaLabel(g), scoreLabel(g)], ["과학, 연습 모드", `점수 ${g.score}`]);
  assertEqual([quizMetaLabel(r), scoreLabel(r)], ["과학, 연습 모드, 다시 풀기", "채점 안 함"]);
});

check("applyAnswer: 문항별 결과를 차례로 기록함", () => {
  let g = createGame("hint", "과학", sciSet());
  const first = g.items[0];
  g = nextQuestion(applyAnswer(applyHint(g), first.answer));
  const second = g.items[1];
  g = nextQuestion(applyAnswer(g, null));
  const third = g.items[2];
  g = applyAnswer(g, (third.answer + 1) % 4);
  assertEqual(g.results, [
    { id: first.id, question: first.question, answerText: first.choices[first.answer], correct: true, timedOut: false, hintUsed: true },
    { id: second.id, question: second.question, answerText: second.choices[second.answer], correct: false, timedOut: true, hintUsed: false },
    { id: third.id, question: third.question, answerText: third.choices[third.answer], correct: false, timedOut: false, hintUsed: false }
  ]);
});
check("formatResultLine: 정답, 힌트, 시간 초과, 오답", () => {
  const r = (correct, timedOut, hintUsed) => ({ answerText: "금", correct, timedOut, hintUsed });
  assertEqual(
    [formatResultLine(r(true, false, false)), formatResultLine(r(true, false, true)), formatResultLine(r(false, true, false)), formatResultLine(r(false, false, false))],
    ["정답", "정답 (힌트 0.5점)", "시간 초과, 정답: 금", "오답, 정답: 금"]);
});

if (typeof document !== "undefined") init();
