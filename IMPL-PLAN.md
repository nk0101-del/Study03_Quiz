<!-- 2026-10-08 12:20 KST -->
# 상식 퀴즈 앱 구현 계획서

> **실행자에게:** 이 계획은 superpowers:executing-plans(이 세션에서 직접 실행)로 태스크 하나씩 진행한다. 진행 표시는 체크박스(`- [ ]`)로 한다. **구현 단계(1, 2, 3단계)가 끝날 때마다 반드시 멈추고**, 사람이 브라우저에서 확인하고 배포를 지시할 때까지 다음 단계로 넘어가지 않는다. 계획과 다르게 정해야 할 일이 생기면 스스로 정하지 말고 멈춰서 사람에게 묻는다.

**목표:** 서버 없이 파일만 열어도 동작하는 4지선다 상식 퀴즈 웹 앱(카테고리 4개, 문항 40개, 모드 3개, 순위표)을 3단계로 만든다.

**구조:** index.html에 화면별 `<section>`을 미리 두고 하나만 보이게 바꿔 전환한다. script.js는 게임 규칙을 DOM과 무관한 순수 함수로 두고(자체 점검 대상), 화면 함수는 그 결과를 그리기만 한다. 문항은 questions.js의 전역 상수 `QUESTIONS`에 둔다.

**기술:** HTML, CSS, 순수 자바스크립트(일반 `<script>`), localStorage, 점검용 Node.js(v24에서 확인함)

**설계 문서:** [PRD.md](PRD.md). 실행자는 이 계획과 PRD를 함께 읽는다. 둘이 어긋나면 PRD를 따르고 사람에게 알린다.

## 전체 제약

- 파일은 `index.html`, `style.css`, `script.js`, `questions.js` 4개뿐이다. 테스트 파일, 빌드 도구, 외부 라이브러리를 더하지 않는다.
- 파일을 더블클릭해 열어도 동작해야 하므로 `fetch()`, JSON 파일, ES 모듈(`type="module"`, `import`, `export`)을 쓰지 않는다. index.html은 `questions.js`, `script.js` 순서로 `<body>` 끝에서 불러온다.
- 문항, 해설, 이름처럼 데이터에서 온 글자는 `textContent`로 넣는다. `innerHTML`에 데이터를 넣지 않는다.
- script.js의 DOM 코드는 `if (typeof document !== "undefined") init();` 한 곳에서만 시작한다. Node.js에서 불러도 오류 없이 순수 함수와 자체 점검만 실행되어야 한다.
- 새로 만드는 파일은 맨 위에 생성 일시를 한국 시각으로 주석으로 남긴다(예: `// 2026-10-08 12:20 KST`, HTML은 `<!-- -->`). 시각은 추측하지 않고 명령으로 확인한다.
- 한국어 문구는 가운뎃점(·) 대신 쉼표를 쓰고, 완결된 문장인 안내와 오류 문구는 마침표로 끝내며, 보조용언은 띄어 쓴다(예: "다시 풀어 보세요."). 버튼 라벨과 제목에는 마침표를 붙이지 않는다.
- 상수: 카테고리 `["한국사", "세계지리", "과학", "예술과 문화"]`, 카테고리 약어 `{ "한국사": "korhist", "세계지리": "geo", "과학": "sci", "예술과 문화": "art" }`, 한 판 10문제, 스피드 제한 시간 15초, 힌트로 지우는 오답 2개, 힌트 정답 0.5점, 순위표 상위 5건, 이름 1~10자, localStorage 키 `quizRecords`.
- 모드 id와 표시 이름: `practice` 연습, `speed` 스피드, `hint` 힌트.
- **점검 명령(CHECK):** 작업 폴더에서 아래 한 줄을 실행한다. 통과하면 `자체 점검: N개 중 N개 통과`가 나오고 종료 코드가 0이다. 실패하면 실패한 항목이 `  실패: ...`로 나오고 종료 코드가 1이다. 아래 태스크에서 "CHECK 실행"은 이 명령을 뜻한다.

```bash
node -e "const fs=require('fs'),vm=require('vm');const r=vm.runInNewContext(fs.readFileSync('questions.js','utf8')+'\n'+fs.readFileSync('script.js','utf8')+'\n;runSelfTest()',{});console.log(r.summary);r.failures.forEach(f=>console.log('  실패: '+f));process.exitCode=r.failures.length?1:0"
```

- **브라우저 자체 점검:** `index.html?test`로 열면 같은 점검을 실행해 화면 위쪽 `#selftest`와 콘솔에 결과를 보여 준다.
- **커밋:** 태스크 끝의 커밋 단계는 작업 폴더가 git 저장소일 때만 한다. 저장소가 아니면 CHECK 통과로 태스크를 마친다. 첫 커밋 전에 `git config user.email`이 사용자의 GitHub noreply 주소인지 확인하고, 아니면 멈추고 사람에게 묻는다. 커밋 메시지 끝에는 `Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>` 줄을 붙인다.

## 문항 작성 규칙 (태스크 3~6)

CLAUDE.md의 문항 작성 규칙 10개와 PRD 2.2절의 규칙 2개를 지키고, 이 계획에서 다음을 더한다.

- **출처로 쓰는 곳:** 한국민족문화대백과사전(encykorea.aks.ac.kr), 우리역사넷(contents.history.go.kr), 국가유산청과 국립 박물관, 미술관 공식 사이트, 정부 기관과 국제기구(NASA, 기상청, UNESCO 등) 공식 페이지, 브리태니커(britannica.com).
- **출처로 쓰지 않는 곳:** 위키백과, 나무위키, 블로그, 카페, 개인 사이트, AI가 만든 요약.
- **부정형 문제를 쓰지 않는다**("~이 아닌 것은?"). 정답이 하나인지 따지기 어려워지기 때문이다.
- **대조 절차:** 문항마다 출처 주소를 실제로 열어(WebFetch 또는 브라우저) 정답과 해설의 사실이 그 페이지에 있는지 확인한다. 열리지 않거나 내용이 없으면 출처를 바꾸거나 문항을 바꾼다. 표본만 확인하고 넘어가지 않는다.
- **검수표:** 문항마다 `| id | 정답 | 출처 주소 | 대조 결과(확인함, 확인 못 함, 사유) |` 한 줄을 만들어 태스크 완료 보고에 붙인다. 파일로 저장하지 않는다.

## 검토 초점

태스크의 일반 점검으로는 드러나지 않지만, 쓰는 사람이 실제로 부딪히기 쉬운 경우들이다. 각 줄의 점검은 괄호 안 태스크에 들어 있다.

1. 스피드 모드에서 시간 초과와 보기 클릭이 거의 동시에 일어나도 한 번만 채점되어야 한다(태스크 7의 "이미 답한 문항은 다시 채점하지 않음", 태스크 10).
2. [다음]을 빠르게 눌러도 타이머가 겹쳐 돌지 않고 1초에 1씩 줄어야 한다(태스크 10의 브라우저 확인).
3. localStorage 값이 깨졌거나 저장소를 쓸 수 없으면, 앱이 멈추지 않고 빈 순위표로 시작하거나 "기록을 저장할 수 없습니다."를 보여 줘야 한다(태스크 13의 `parseRecords`, 태스크 14).
4. 이름에 공백만 넣거나 10자를 넘겨도 이상한 기록이 남지 않아야 한다(태스크 13의 `normalizeName`).
5. 힌트가 정답을 지우거나, 힌트를 두 번 쓰거나, 답한 뒤에 힌트가 동작하면 안 된다(태스크 11의 `applyHint`).

---

# 1단계: 연습 모드와 점수

### 태스크 1: 파일 뼈대와 자체 점검 틀

**파일:**
- 만들기: `index.html`, `style.css`, `script.js`, `questions.js`

**인터페이스:**
- 만드는 것:
  - `QUESTIONS: Array` (questions.js, 처음에는 `[]`)
  - `check(name: string, fn: () => void)`: 점검 항목을 등록한다.
  - `assertEqual(actual, expected, label?: string)`: `JSON.stringify` 값이 다르면 `기댓값 ..., 실제값 ...`이 든 Error를 던진다.
  - `runSelfTest() -> { total, passed, failures: string[], summary: string }`. `summary`는 `자체 점검: ${total}개 중 ${passed}개 통과`.
  - `showScreen(id: string)`: `id`인 section만 보이고 나머지 section은 `hidden`이 된다.
  - index.html의 section id: `screen-start`, `screen-quiz`, `screen-result`, `screen-error`. 화면 위쪽에 `<div id="selftest" hidden>`.

- [ ] **1단계: 생성 일시를 확인한다**

실행: `powershell -Command "[System.TimeZoneInfo]::ConvertTimeBySystemTimeZoneId([DateTime]::UtcNow, 'Korea Standard Time').ToString('yyyy-MM-dd HH:mm')"`
(Git Bash의 `TZ=Asia/Seoul date`는 이 컴퓨터에서 UTC를 돌려주므로 쓰지 않는다.)

- [ ] **2단계: 4개 파일을 만든다**

- `questions.js`: 생성 일시 주석, `const QUESTIONS = [];`
- `index.html`: `lang="ko"`, `<meta name="viewport" content="width=device-width, initial-scale=1">`, 제목 `상식 퀴즈`, `style.css` 연결, 위의 section 4개(처음에는 모두 `hidden`), `<body>` 끝에 `questions.js`, `script.js`.
- `style.css`: 본문 폭 최대 640px 가운데 정렬, 폭 360px에서 가로 스크롤 없음, 보기 버튼은 한 줄에 하나씩 꽉 차게, `.correct`(초록 바탕), `.wrong`(빨강 바탕), `#selftest` 배너(통과는 초록, 실패는 빨강).
- `script.js`: 생성 일시 주석, `check`, `assertEqual`, `runSelfTest`, `showScreen`, `init()`. 파일 맨 끝은 `if (typeof document !== "undefined") init();`.
- `init()`은 주소에 `test` 매개변수가 있으면(`new URLSearchParams(location.search).has("test")`) `runSelfTest()` 결과의 `summary`와 실패 목록을 `#selftest`에 보이고 콘솔에도 출력한 뒤, `showScreen("screen-start")`를 부른다.
- 점검 하나를 등록한다: `check("자체 점검 틀이 동작함", () => assertEqual(typeof runSelfTest, "function"));`

- [ ] **3단계: CHECK 실행**

기대: `자체 점검: 1개 중 1개 통과`, 종료 코드 0

- [ ] **4단계: 커밋**

```bash
git add index.html style.css script.js questions.js
git commit -m "feat: 파일 뼈대와 자체 점검 틀 추가"
```

### 태스크 2: 문항 처리 순수 함수

**파일:**
- 고치기: `script.js`

**인터페이스:**
- 쓰는 것: 태스크 1의 `check`, `assertEqual`
- 만드는 것:
  - `CATEGORIES`, `CATEGORY_IDS`, `QUESTIONS_PER_GAME = 10` (전체 제약의 값)
  - `shuffle(array, rand = Math.random) -> Array`: 새 배열을 돌려주고 원본은 바꾸지 않는다. 피셔-예이츠 방식으로 `i`를 끝에서 1까지 줄이며 `j = Math.floor(rand() * (i + 1))`와 맞바꾼다.
  - `prepareQuestion(question, rand = Math.random) -> 문항`: 보기를 섞은 새 문항 객체를 돌려준다. `answer`는 섞인 보기에서 원래 정답의 위치다. 원본은 바꾸지 않는다.
  - `scoreFor(correct: boolean, hintUsed: boolean) -> 1 | 0.5 | 0`
  - `formatScore(score: number, total: number) -> string`: `"7 / 10"`, `"7.5 / 10"`
  - `validateQuestions(list) -> string[]`: 오류 문장 목록. 오류가 없으면 `[]`. 문항별 오류 문장에는 그 문항의 `id`가 들어간다.
  - 점검용 도우미 `makeQuestion(category, n)`, `makeFullSet()`: 규칙에 맞는 가짜 문항과 40개 묶음을 만든다(id는 `${CATEGORY_IDS[category]}-${두 자리 번호}`).

- [ ] **1단계: 점검 항목을 먼저 쓴다**

```js
check("shuffle: 정해진 난수로 정해진 순서", () => assertEqual(shuffle([1, 2, 3, 4], () => 0), [2, 3, 4, 1]));
check("shuffle: 원본을 바꾸지 않음", () => { const a = [1, 2, 3, 4]; shuffle(a); assertEqual(a, [1, 2, 3, 4]); });
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
```

다음 경우마다 `makeFullSet()`을 하나 고친 뒤 `validateQuestions` 결과에 기대한 글자가 든 오류가 있는지(`errors.some(e => e.includes(...))`) 확인하는 점검을 하나씩 더한다.

| 고치는 곳 | 오류에 들어 있어야 할 글자 |
|---|---|
| `set[0].choices = ["가", "나", "다"]` | `korhist-01` |
| `set[0].choices = ["가", "가", "다", "라"]` | `korhist-01` |
| `set[0].answer = 4` | `korhist-01` |
| `set[0].explanation = ""` | `korhist-01` |
| `set[0].source.url = ""` | `korhist-01` |
| `set[0].category = "수학"` | `korhist-01` |
| `set[1].id = "korhist-01"` | `중복` |
| 세계지리 문항 하나를 지움 | `세계지리` |

- [ ] **2단계: CHECK 실행, 실패 확인**

기대: 종료 코드 1, `shuffle is not defined` 같은 실패가 나옴

- [ ] **3단계: 위 인터페이스의 함수들을 script.js에 만든다**

`validateQuestions`는 문항마다 카테고리가 4개 중 하나인지, 문제가 비어 있지 않은지, 보기가 서로 다른 4개인지, `answer`가 0~3의 정수인지, 해설과 `source.name`, `source.url`이 비어 있지 않은지 보고, 끝으로 id 중복과 카테고리별 개수(10개)를 본다.

- [ ] **4단계: CHECK 실행, 통과 확인**

기대: `자체 점검: 15개 중 15개 통과`, 종료 코드 0

- [ ] **5단계: 커밋**

```bash
git add script.js
git commit -m "feat: 섞기, 채점, 문항 검사 순수 함수 추가"
```

### 태스크 3: 한국사 문항 10개

**파일:**
- 고치기: `questions.js`, `script.js`(점검 한 줄)

**인터페이스:**
- 쓰는 것: 태스크 2의 `validateQuestions`, 위의 "문항 작성 규칙"
- 만드는 것: `QUESTIONS`에 `korhist-01`~`korhist-10`

- [ ] **1단계: 점검 항목을 먼저 쓴다**

```js
check("한국사 문항 10개가 규칙에 맞음", () => {
  const list = QUESTIONS.filter(q => q.category === "한국사");
  assertEqual(list.length, 10);
  assertEqual(validateQuestions(list).filter(e => !e.includes("문항이")), []);
});
```

(카테고리 개수 오류는 다른 카테고리가 아직 없어서 생기므로 이 점검에서는 제외한다. `validateQuestions`의 개수 오류 문장에는 `문항이`가 들어가게 한다. 예: `세계지리 문항이 9개입니다.`)

- [ ] **2단계: CHECK 실행, 실패 확인**

기대: `한국사 문항 10개가 규칙에 맞음: 기댓값 10, 실제값 0`

- [ ] **3단계: 문항 10개를 쓴다**

PRD 4.1절의 형식을 따른다. 시대가 한쪽에 몰리지 않게 고대부터 현대까지 고루 낸다. 최상급 표현을 쓰면 기준과 시점을 문제에 적는다.

- [ ] **4단계: 출처 10개를 모두 열어 대조한다**

문항마다 출처 주소를 열어 정답과 해설의 사실이 페이지에 있는지 확인하고 검수표 한 줄을 만든다. "확인 못 함"이 남으면 출처나 문항을 바꾼 뒤 다시 대조한다.

- [ ] **5단계: CHECK 실행, 통과 확인**

기대: 실패 0개, 종료 코드 0

- [ ] **6단계: 커밋**

```bash
git add questions.js script.js
git commit -m "feat: 한국사 문항 10개 추가"
```

### 태스크 4: 세계지리 문항 10개

태스크 3과 같은 단계로 진행한다. 다른 점만 적는다.
- 점검 이름 `세계지리 문항 10개가 규칙에 맞음`, 카테고리 `세계지리`, id `geo-01`~`geo-10`
- 면적, 인구, 높이처럼 값이 바뀌거나 기준이 여럿인 문항은 기준과 시점(예: "2024년 유엔 추계 기준")을 문제에 적는다.
- 커밋 메시지 `feat: 세계지리 문항 10개 추가`

### 태스크 5: 과학 문항 10개

태스크 3과 같은 단계로 진행한다.
- 점검 이름 `과학 문항 10개가 규칙에 맞음`, 카테고리 `과학`, id `sci-01`~`sci-10`
- 물리, 화학, 생명, 지구과학을 고루 낸다.
- 커밋 메시지 `feat: 과학 문항 10개 추가`

### 태스크 6: 예술과 문화 문항 10개

태스크 3과 같은 단계로 진행한다.
- 점검 이름 `예술과 문화 문항 10개가 규칙에 맞음`, 카테고리 `예술과 문화`, id `art-01`~`art-10`
- 미술, 음악, 문학, 건축, 전통문화를 고루 낸다.
- 이 태스크의 1단계에서 전체 점검도 한 줄 더한다: `check("문항 40개 전체가 규칙에 맞음", () => assertEqual(validateQuestions(QUESTIONS), []));`
- 커밋 메시지 `feat: 예술과 문화 문항 10개 추가`

### 태스크 7: 게임 진행 함수와 문제 화면 (연습 모드)

**파일:**
- 고치기: `script.js`, `index.html`, `style.css`

**인터페이스:**
- 쓰는 것: 태스크 2의 `shuffle`, `prepareQuestion`, `scoreFor`, `formatScore`, `makeQuestion`, `makeFullSet`
- 만드는 것(순수 함수, 모두 새 객체를 돌려주고 인수를 바꾸지 않음):
  - `questionsOf(category: string, all = QUESTIONS) -> 문항[]`
  - `createGame(mode, category, questions, rand = Math.random, isRetry = false) -> game`. `game`은 `{ mode, category, items, index: 0, score: 0, correctCount: 0, wrongIds: [], answered: false, hintUsed: false, removed: [], lastResult: null, isRetry }`이고, `items`는 `questions`를 섞은 뒤 문항마다 `prepareQuestion`을 적용한 것이다.
  - `applyAnswer(game, choiceIndex: number | null) -> game`. `null`은 시간 초과다. 채점은 `scoreFor(맞힘, game.hintUsed)`로 하고, `lastResult = { correct, choice, timedOut }`을 넣는다. 틀리면 `wrongIds`에 원래 문항 id를 더한다. **이미 답한 문항이면(`game.answered`) 받은 `game`을 그대로 돌려준다.**
  - `nextQuestion(game) -> game`: `index + 1`, `answered: false`, `hintUsed: false`, `removed: []`, `lastResult: null`
  - `isLastQuestion(game) -> boolean`: `index === items.length - 1`
- 만드는 것(화면): `state = { game: null, firstGame: null }`, `startGame(mode, category)`, `renderQuestion()`, `selectChoice(index)`, `handleNext()`
- index.html: `screen-start`에 연습 모드 설명(시간 제한과 힌트 없음, 맞히면 1점)과 "순위표에 기록되지 않음", 카테고리 버튼 4개. `screen-quiz`에 `#quiz-meta`, `#quiz-progress`, `#quiz-score`, `#quiz-question`, `#choices`(버튼 4개), `#feedback`(`#feedback-verdict`, `#feedback-explanation`, `#feedback-source` 링크), `#btn-next`.

- [ ] **1단계: 점검 항목을 먼저 쓴다**

```js
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
```

- [ ] **2단계: CHECK 실행, 실패 확인**

기대: `createGame is not defined` 같은 실패

- [ ] **3단계: 순수 함수를 만든다**

- [ ] **4단계: CHECK 실행, 통과 확인**

- [ ] **5단계: 시작 화면과 문제 화면을 만든다**

- 카테고리 버튼을 누르면 `startGame("practice", 카테고리)`가 `state.game`과 `state.firstGame`을 만들고 `screen-quiz`를 보인다.
- `#quiz-meta`는 `한국사, 연습 모드`, `#quiz-progress`는 `1 / 10`, `#quiz-score`는 `점수 0`(0.5점이 있으면 `점수 1.5`)이다.
- 보기를 누르면 `selectChoice`가 `applyAnswer`를 부르고, 모든 보기를 `disabled`로 바꾼 뒤, 정답 보기에 `.correct`, 고른 보기가 오답이면 그 보기에 `.wrong`을 단다.
- `#feedback-verdict`는 `정답입니다.` 또는 `오답입니다.`, `#feedback-explanation`은 해설, `#feedback-source`는 `출처: ${source.name}`이고 `href`가 출처 주소, `target="_blank"`, `rel="noopener"`다.
- `#btn-next`는 답한 뒤에만 보인다. 마지막 문제에서는 글자가 `결과 보기`이고, 누르면 `showResult()`를 부른다(태스크 8에서 만든다. 이 태스크에서는 `screen-result`만 보이게 한다).

- [ ] **6단계: 브라우저로 확인한다**

`index.html`을 열어 한국사를 한 판 끝까지 눌러 본다. 정답과 오답의 색, 해설, 출처 링크가 나오고, 콘솔에 오류가 없어야 한다.

- [ ] **7단계: 커밋**

```bash
git add script.js index.html style.css
git commit -m "feat: 연습 모드 문제 화면과 게임 진행 함수 추가"
```

### 태스크 8: 결과 화면과 문항 데이터 오류 화면

**파일:**
- 고치기: `script.js`, `index.html`, `style.css`

**인터페이스:**
- 쓰는 것: 태스크 7의 `state`, `startGame`, `formatScore`, 태스크 2의 `validateQuestions`
- 만드는 것: `showResult()`. `screen-result`에 `#result-title`, `#result-score`, `#result-note`, `#btn-again`, `#btn-home`. `screen-error`에 `#error-list`.

- [ ] **1단계: 결과 화면을 만든다**

- `#result-title`은 `한국사, 연습 모드 결과`, `#result-score`는 `formatScore(state.firstGame의 점수, 10)`이다.
- 연습 모드면 `#result-note`에 `순위표에 기록되지 않음`을 보인다.
- `[다시 하기]`는 같은 모드와 카테고리로 `startGame`을 다시 부르고(새로 섞임), `[처음으로]`는 `screen-start`로 간다.

- [ ] **2단계: 문항 데이터 오류 화면을 만든다**

`init()`에서 `validateQuestions(QUESTIONS)`의 결과가 비어 있지 않으면 `screen-error`에 `문항 데이터에 오류가 있습니다.`와 오류 목록을 보이고 시작 화면을 보이지 않는다.

- [ ] **3단계: 오류 화면을 확인한다**

`questions.js`에서 문항 하나의 `answer`를 잠시 `9`로 바꿔 열면 오류 화면이 나와야 한다. 확인한 뒤 원래 값으로 되돌린다.

- [ ] **4단계: CHECK 실행, 통과 확인**

- [ ] **5단계: 커밋**

```bash
git add script.js index.html style.css
git commit -m "feat: 결과 화면과 문항 데이터 오류 화면 추가"
```

## 1단계 끝: 여기서 멈춘다

**완료 기준 (클로드가 점검하고 보고함)**
- CHECK가 실패 0개로 통과한다.
- 문항 40개의 검수표가 모두 "확인함"이고, 완료 보고에 붙어 있다.
- 파일이 4개(`index.html`, `style.css`, `script.js`, `questions.js`)뿐이다(PRD.md, IMPL-PLAN.md 제외).
- 모드 선택 화면과 틀린 문제 다시 풀기는 아직 없다.
- 계획과 다르게 정한 것이 있으면 완료 보고에 모두 적는다.

**직접 확인할 항목 (사람이 브라우저에서)**
1. `index.html`을 더블클릭해 열면 시작 화면에 연습 모드 설명과 "순위표에 기록되지 않음"이 보인다.
2. 카테고리 버튼 4개(한국사, 세계지리, 과학, 예술과 문화)가 있다.
3. [한국사]를 누르면 위쪽에 "한국사, 연습 모드", "1 / 10", "점수 0"이 보인다.
4. 보기 4개가 한 줄에 하나씩 보인다.
5. 정답을 고르면 그 보기가 초록이 되고 "정답입니다."와 해설, 출처 링크가 나온다. 점수가 1 오른다.
6. 오답을 고르면 고른 보기는 빨강, 정답 보기는 초록이 되고 "오답입니다."가 나온다. 점수는 그대로다.
7. 답한 뒤에는 다른 보기를 눌러도 아무 일이 없다.
8. 출처 링크를 누르면 새 탭에서 출처 페이지가 열리고, 해설의 내용이 그 페이지에 있다.
9. 10번째 문제에서 버튼이 [결과 보기]로 바뀌고, 결과 화면에 점수(예: 7 / 10)와 "순위표에 기록되지 않음"이 보인다.
10. [다시 하기]를 누르면 같은 카테고리가 다른 문항 순서와 보기 순서로 시작된다.
11. [처음으로]를 누르면 시작 화면으로 돌아간다.
12. 개발자 도구(F12)의 콘솔에 빨간 오류가 없다.
13. 개발자 도구의 기기 모드에서 폭 360px로 줄여도 가로 스크롤이 생기지 않고 버튼을 누를 수 있다.
14. `index.html?test`로 열면 위쪽에 "자체 점검: N개 중 N개 통과"가 초록으로 보인다.

사람이 확인하고 배포를 지시할 때까지 2단계를 시작하지 않는다.

---

# 2단계: 스피드 모드, 힌트 모드, 모드 선택 화면, 틀린 문제 다시 풀기

### 태스크 9: 모드 선택 화면

**파일:**
- 고치기: `index.html`, `script.js`, `style.css`

**인터페이스:**
- 쓰는 것: 태스크 7의 `startGame(mode, category)`
- 만드는 것: `MODES = { practice: "연습", speed: "스피드", hint: "힌트" }`, `chooseMode(mode)`, section `screen-category`(카테고리 버튼 4개를 시작 화면에서 이곳으로 옮김, `[처음으로]` 포함)

- [ ] **1단계: 점검 항목을 먼저 쓴다**

```js
check("모드 3개의 표시 이름", () => assertEqual(MODES, { practice: "연습", speed: "스피드", hint: "힌트" }));
```

- [ ] **2단계: CHECK 실행, 실패 확인**

- [ ] **3단계: 시작 화면을 모드 선택 화면으로 바꾼다**

- 시작 화면에 모드 3개를 설명과 함께 버튼으로 둔다.
  - 연습: 시간 제한과 힌트 없음, 맞히면 1점, 순위표에 기록되지 않음
  - 스피드: 문항마다 15초, 시간이 지나면 오답, 맞히면 1점
  - 힌트: 문항마다 힌트 1번(오답 보기 2개를 지움), 힌트 없이 맞히면 1점, 힌트를 쓰고 맞히면 0.5점
- 모드를 누르면 `chooseMode`가 고른 모드를 기억하고 `screen-category`를 보인다. 카테고리를 누르면 `startGame(고른 모드, 카테고리)`를 부른다.
- `#quiz-meta`와 결과 제목의 모드 이름은 `MODES[mode]`로 바꾼다(예: `과학, 스피드 모드`).

- [ ] **4단계: CHECK 실행, 통과 확인**

- [ ] **5단계: 커밋**

```bash
git add index.html script.js style.css
git commit -m "feat: 모드 선택 화면 추가"
```

### 태스크 10: 스피드 모드 타이머

**파일:**
- 고치기: `script.js`, `index.html`, `style.css`

**인터페이스:**
- 쓰는 것: 태스크 7의 `applyAnswer(game, null)`, `selectChoice`, `handleNext`
- 만드는 것: `TIME_LIMIT = 15`, `state.timerId`, `state.timeLeft`, `startTimer()`, `stopTimer()`, `onTimeout()`, `#quiz-timer`

- [ ] **1단계: 점검 항목을 먼저 쓴다**

```js
check("스피드 제한 시간은 15초", () => assertEqual(TIME_LIMIT, 15));
```

- [ ] **2단계: CHECK 실행, 실패 확인**

- [ ] **3단계: 타이머를 만든다**

- `startTimer()`는 **먼저 `stopTimer()`를 부른 뒤** `state.timeLeft = TIME_LIMIT`로 두고 1초마다 1씩 줄이며 `#quiz-timer`에 `남은 시간 15초`처럼 보인다. 0이 되면 `onTimeout()`을 부른다.
- `onTimeout()`은 `stopTimer()` 후 `applyAnswer(game, null)`로 채점하고, 보기를 잠그고 정답 보기를 초록으로 표시한 뒤 `#feedback-verdict`에 `시간 초과입니다. 오답입니다.`, 해설, 출처를 보인다.
- `selectChoice`는 채점하기 전에 `stopTimer()`를 부른다. 그래서 해설이 나와 있는 동안 타이머가 멈춘다.
- 스피드 모드에서만 `renderQuestion()`이 `startTimer()`를 부른다. 다른 모드에서는 `#quiz-timer`를 숨긴다.
- `[처음으로]`나 결과 화면으로 갈 때도 `stopTimer()`를 부른다.

- [ ] **4단계: CHECK 실행, 통과 확인**

- [ ] **5단계: 브라우저로 확인한다**

스피드 모드에서 한 문항은 그냥 두어 시간 초과를 보고, 한 문항은 답을 고른 뒤 숫자가 멈추는지 본다. [다음]을 빠르게 여러 번 눌러도 1초에 1씩만 줄어야 한다.

- [ ] **6단계: 커밋**

```bash
git add script.js index.html style.css
git commit -m "feat: 스피드 모드 15초 타이머 추가"
```

### 태스크 11: 힌트 모드

**파일:**
- 고치기: `script.js`, `index.html`, `style.css`

**인터페이스:**
- 쓰는 것: 태스크 7의 `game`, `applyAnswer`, `renderQuestion`
- 만드는 것:
  - `applyHint(game, rand = Math.random) -> game`: 현재 문항의 오답 보기 가운데 서로 다른 2개의 위치를 `removed`에 넣고 `hintUsed: true`로 둔다. 모드가 `hint`가 아니거나, 이미 힌트를 썼거나, 이미 답했으면 받은 `game`을 그대로 돌려준다.
  - `useHint()`, `#btn-hint`

- [ ] **1단계: 점검 항목을 먼저 쓴다**

```js
const hintGame = () => createGame("hint", "과학", sciSet());
check("applyHint: 오답 2개를 지우고 정답은 남김", () => {
  const g = hintGame();
  const h = applyHint(g);
  assertEqual([h.hintUsed, h.removed.length, new Set(h.removed).size], [true, 2, 2]);
  assertEqual(h.removed.includes(g.items[0].answer), false);
  assertEqual(g.hintUsed, false);
});
check("applyHint: 한 문항에 한 번만", () => { const h = applyHint(hintGame()); assertEqual(applyHint(h) === h, true); });
check("applyHint: 힌트 모드가 아니면 동작하지 않음", () => { const g = createGame("practice", "과학", sciSet()); assertEqual(applyHint(g) === g, true); });
check("applyHint: 답한 뒤에는 동작하지 않음", () => { const a = applyAnswer(hintGame(), 0); assertEqual(applyHint(a) === a, true); });
check("힌트를 쓰고 맞히면 0.5점", () => {
  const h = applyHint(hintGame());
  assertEqual(applyAnswer(h, h.items[0].answer).score, 0.5);
});
check("다음 문항에서 힌트를 다시 쓸 수 있음", () => {
  const n = nextQuestion(applyAnswer(applyHint(hintGame()), 0));
  assertEqual([n.hintUsed, n.removed], [false, []]);
});
```

- [ ] **2단계: CHECK 실행, 실패 확인**

- [ ] **3단계: 힌트 버튼을 만든다**

- 힌트 모드에서만 `#btn-hint`(라벨 `힌트`)를 보인다.
- 누르면 `useHint()`가 `applyHint`를 부르고, `removed`에 든 보기 버튼을 `visibility: hidden`과 `disabled`로 바꾼다. 자리는 그대로 남아 다른 보기의 위치가 바뀌지 않는다.
- 힌트를 썼거나 답한 뒤에는 `#btn-hint`를 `disabled`로 바꾼다.

- [ ] **4단계: CHECK 실행, 통과 확인**

- [ ] **5단계: 커밋**

```bash
git add script.js index.html style.css
git commit -m "feat: 힌트 모드 추가"
```

### 태스크 12: 틀린 문제 다시 풀기 (연습 전용)

**파일:**
- 고치기: `script.js`, `index.html`

**인터페이스:**
- 쓰는 것: 태스크 7의 `createGame`, `state.firstGame`, 태스크 8의 `showResult`
- 만드는 것:
  - `createRetry(game, all = QUESTIONS, rand = Math.random) -> game`: `game.wrongIds`의 원래 문항으로 `createGame("practice", game.category, 그 문항들, rand, true)`를 돌려준다.
  - `formatRetrySummary(correctCount: number, total: number) -> string`: `"3문제 중 2문제 맞힘"`
  - `startRetry()`, `#btn-retry-wrong`(라벨 `틀린 문제 다시 풀기`), `#retry-summary`

- [ ] **1단계: 점검 항목을 먼저 쓴다**

```js
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
```

- [ ] **2단계: CHECK 실행, 실패 확인**

- [ ] **3단계: 다시 풀기를 만든다**

- 연습 모드 결과 화면에서 `state.game.wrongIds`가 비어 있지 않으면 `[틀린 문제 다시 풀기]`를 보인다.
- 누르면 `startRetry()`가 `state.game = createRetry(state.game)`로 두고 문제 화면을 보인다. `state.firstGame`은 바꾸지 않는다. `#quiz-progress`는 `1 / 3`처럼 다시 풀 문항 수를 기준으로 한다.
- 다시 풀기가 끝난 결과 화면은 `#result-score`에 `state.firstGame`의 점수를 그대로 보이고, `#retry-summary`에 `formatRetrySummary(...)`를 보인다. 또 틀린 문항이 있으면 버튼을 다시 보이고, 없으면 `모두 맞혔습니다.`를 보인다.
- `[다시 하기]`는 다시 풀기 중이어도 처음 10문제의 새 판을 시작한다.

- [ ] **4단계: CHECK 실행, 통과 확인**

- [ ] **5단계: 커밋**

```bash
git add script.js index.html
git commit -m "feat: 연습 모드 틀린 문제 다시 풀기 추가"
```

## 2단계 끝: 여기서 멈춘다

**완료 기준 (클로드가 점검하고 보고함)**
- CHECK가 실패 0개로 통과한다(1단계 점검 포함).
- 파일이 여전히 4개뿐이다.
- 계획과 다르게 정한 것이 있으면 완료 보고에 모두 적는다.

**직접 확인할 항목 (사람이 브라우저에서)**
1. 시작 화면에 모드 3개(연습, 스피드, 힌트)가 설명과 함께 보이고, 연습 모드 설명에 "순위표에 기록되지 않음"이 있다.
2. 모드를 누르면 카테고리 선택 화면이 나오고, 거기서 [처음으로]를 누르면 시작 화면으로 돌아간다.
3. 문제 화면 위쪽에 고른 카테고리와 모드(예: "과학, 스피드 모드")가 보인다.
4. 스피드 모드에서 "남은 시간 15초"부터 1초에 1씩 줄어든다.
5. 답을 고르지 않고 두면 0초에 "시간 초과입니다. 오답입니다."와 정답, 해설이 나오고 점수는 그대로다.
6. 답을 고르면 숫자가 멈춘 채 그대로 있다.
7. [다음]을 누르면 다시 15초부터 센다. [다음]을 빠르게 여러 번 눌러도 1초에 1씩만 줄어든다.
8. 연습 모드와 힌트 모드에서는 타이머가 보이지 않는다.
9. 힌트 모드에서 [힌트]를 누르면 보기 2개가 사라지고 정답은 남아 있으며, 남은 보기의 위치는 그대로다.
10. 힌트를 한 번 쓰면 그 문항에서는 [힌트]를 다시 누를 수 없고, 다음 문항에서는 다시 쓸 수 있다.
11. 힌트를 쓰고 맞히면 점수가 0.5 오르고, 힌트 없이 맞히면 1 오른다.
12. 힌트를 쓰고 맞힌 문항이 있으면 결과 점수가 "7.5 / 10"처럼 0.5 단위로 나온다.
13. 연습 모드 결과에서 틀린 문제가 있으면 [틀린 문제 다시 풀기]가 보이고, 스피드와 힌트 모드 결과에는 보이지 않는다.
14. 다시 풀기는 틀린 문항만 "1 / 3"처럼 나온다.
15. 다시 풀기를 마치면 처음 점수는 그대로이고 "3문제 중 2문제 맞힘"처럼 결과가 따로 나온다.
16. 또 틀린 문제가 있으면 버튼이 다시 나오고, 모두 맞히면 "모두 맞혔습니다."가 나온다.
17. 콘솔에 오류가 없고, 폭 360px에서 가로 스크롤이 없으며, `index.html?test`가 모두 통과한다.

사람이 확인하고 배포를 지시할 때까지 3단계를 시작하지 않는다.

---

# 3단계: 점수 저장과 순위표

### 태스크 13: 기록 처리 순수 함수

**파일:**
- 고치기: `script.js`

**인터페이스:**
- 만드는 것:
  - `RECORDS_KEY = "quizRecords"`, `TOP_N = 5`, `NAME_MAX = 10`
  - `recordKey(mode, category) -> string`: `"speed|한국사"`
  - `normalizeName(raw: string) -> string`: 앞뒤 공백을 지우고 앞에서 10자까지만 남긴다.
  - `parseRecords(text: string | null) -> object`: JSON이 아니거나, 객체가 아니거나, 배열이면 `{}`
  - `addRecord(records, mode, category, record) -> object`: 새 객체를 돌려주고 `records`는 바꾸지 않는다.
  - `rankRecords(list) -> 기록[]`: 점수 내림차순, 같으면 `time` 오름차순으로 정렬해 상위 5건
  - `formatDate(time: number) -> string`: 컴퓨터의 현지 날짜로 `"2026-10-08"`
  - `loadRecords() -> object`: localStorage를 읽어 `parseRecords`로 바꾼다. 읽다가 예외가 나면 `{}`
  - `saveRecords(records) -> boolean`: 저장에 성공하면 `true`, 예외가 나면 `false`

- [ ] **1단계: 점검 항목을 먼저 쓴다**

```js
check("recordKey", () => assertEqual(recordKey("speed", "한국사"), "speed|한국사"));
check("normalizeName", () => assertEqual(
  [normalizeName("  홍길동 "), normalizeName("   "), normalizeName("가나다라마바사아자차카")],
  ["홍길동", "", "가나다라마바사아자차"]));
check("parseRecords: 깨진 값은 빈 기록", () => assertEqual(
  [parseRecords(null), parseRecords("not json"), parseRecords("[1,2]"), parseRecords("7")], [{}, {}, {}, {}]));
check("parseRecords: 올바른 값은 그대로", () => {
  const v = { "speed|과학": [{ name: "가", score: 7, date: "2026-10-08", time: 1 }] };
  assertEqual(parseRecords(JSON.stringify(v)), v);
});
check("addRecord: 새 객체에 더함", () => {
  const before = {};
  const after = addRecord(before, "hint", "과학", { name: "가", score: 7.5, date: "2026-10-08", time: 1 });
  assertEqual(after, { "hint|과학": [{ name: "가", score: 7.5, date: "2026-10-08", time: 1 }] });
  assertEqual(before, {});
});
check("rankRecords: 점수순, 동점이면 먼저 세운 기록이 위, 5건까지", () => {
  const r = (name, score, time) => ({ name, score, date: "2026-10-08", time });
  const ranked = rankRecords([r("a", 5, 1), r("b", 8, 3), r("c", 8, 2), r("d", 9, 4), r("e", 3, 5), r("f", 7, 6), r("g", 6, 7)]);
  assertEqual(ranked.map(x => x.name), ["d", "c", "b", "f", "g"]);
});
check("formatDate", () => assertEqual(formatDate(new Date(2026, 9, 8, 12, 0).getTime()), "2026-10-08"));
```

- [ ] **2단계: CHECK 실행, 실패 확인**

- [ ] **3단계: 위 인터페이스의 함수들을 만든다**

`loadRecords`와 `saveRecords`는 `try`/`catch`로 감싸고, 점검에서는 부르지 않는다(Node.js에는 localStorage가 없음).

- [ ] **4단계: CHECK 실행, 통과 확인**

- [ ] **5단계: 커밋**

```bash
git add script.js
git commit -m "feat: 기록 처리 순수 함수 추가"
```

### 태스크 14: 기록 저장 화면과 순위표 화면

**파일:**
- 고치기: `index.html`, `script.js`, `style.css`

**인터페이스:**
- 쓰는 것: 태스크 13의 함수 전부, 태스크 8의 `showResult`
- 만드는 것: `saveRecord()`, `renderLeaderboard(container, mode, category)`, `showLeaderboard()`, 결과 화면의 `#record-form`(`#record-name`은 `maxlength="10"`, `#btn-save-record`, `#record-message`, `#record-board`), section `screen-leaderboard`, 시작 화면의 `[순위표 보기]`

- [ ] **1단계: 결과 화면에 기록 저장을 만든다**

- 스피드와 힌트 모드 결과에서만 `#record-form`을 보인다. 연습 모드에서는 숨긴다.
- `#btn-save-record`(라벨 `기록 저장`)는 `normalizeName(입력값)`이 비어 있으면 `disabled`다(입력할 때마다 다시 판단).
- 누르면 `saveRecord()`가 `{ name, score: state.firstGame의 점수, date: formatDate(Date.now()), time: Date.now() }`를 `addRecord`로 더하고 `saveRecords`로 저장한다.
  - 성공하면 입력칸과 버튼을 `disabled`로 바꾸고, `#record-message`에 `기록을 저장했습니다.`를 보이고, `#record-board`에 이 모드와 카테고리의 순위표를 그린다.
  - 실패하면 `#record-message`에 `기록을 저장할 수 없습니다.`를 보인다.

- [ ] **2단계: 순위표 화면을 만든다**

- `renderLeaderboard`는 표 하나를 그린다. 제목은 `한국사, 스피드 모드`이고, 열은 순위, 이름, 점수, 날짜다. 기록은 `rankRecords`로 고른 5건이며, 없으면 `아직 기록이 없습니다.`를 보인다.
- `showLeaderboard()`는 `screen-leaderboard`에 스피드 모드 표 4개, 힌트 모드 표 4개를 차례로 그리고 `[처음으로]`를 둔다.
- 시작 화면에 `[순위표 보기]`를 둔다.

- [ ] **3단계: CHECK 실행, 통과 확인**

- [ ] **4단계: 깨진 값으로 확인한다**

브라우저 콘솔에서 `localStorage.setItem("quizRecords", "{깨짐")` 후 새로 고쳐 [순위표 보기]를 누르면 오류 없이 모든 표에 "아직 기록이 없습니다."가 나와야 한다. 그 상태에서 한 판을 저장하면 정상 저장된다.

- [ ] **5단계: 커밋**

```bash
git add index.html script.js style.css
git commit -m "feat: 기록 저장과 순위표 화면 추가"
```

## 3단계 끝: 여기서 멈춘다

**완료 기준 (클로드가 점검하고 보고함)**
- CHECK가 실패 0개로 통과한다(1, 2단계 점검 포함).
- 파일이 여전히 4개뿐이다.
- 계획과 다르게 정한 것이 있으면 완료 보고에 모두 적는다.

**직접 확인할 항목 (사람이 브라우저에서)**
1. 스피드 모드와 힌트 모드 결과 화면에 이름 입력칸과 [기록 저장]이 있다.
2. 연습 모드 결과 화면에는 이름 입력칸이 없고 "순위표에 기록되지 않음"이 있다.
3. 이름을 비우거나 공백만 넣으면 [기록 저장]을 누를 수 없다.
4. 이름 입력칸에 10자를 넘겨 입력할 수 없다.
5. 저장하면 "기록을 저장했습니다."가 나오고, 입력칸과 버튼이 잠기며, 그 모드와 카테고리의 순위표가 나온다.
6. 시작 화면의 [순위표 보기]를 누르면 표 8개(스피드 4개, 힌트 4개)가 나온다.
7. 기록이 없는 표에는 "아직 기록이 없습니다."가 나온다.
8. 한 표에 6건 이상 저장해도 상위 5건만 보인다.
9. 같은 점수를 두 번 저장하면 먼저 저장한 기록이 위에 있다.
10. 힌트 모드의 0.5점 기록이 "7.5"처럼 보인다.
11. 페이지를 새로 고쳐도 기록이 남아 있다.
12. 콘솔에 오류가 없고, 폭 360px에서 순위표가 가로 스크롤 없이 보이며, `index.html?test`가 모두 통과한다.

사람이 확인하고 배포를 지시할 때까지 다른 작업을 시작하지 않는다.

---

## PRD 대응표

| PRD 항목 | 구현 태스크 |
|---|---|
| 1. 파일 4개, 서버 없음 | 1 |
| 2.1 연습 모드(1점, 순위표 미기록 표시) | 7, 8 |
| 2.1 스피드 모드(15초, 시간 초과 오답, 타이머 멈춤과 재시작) | 10 |
| 2.1 힌트 모드(1번, 오답 2개 지움, 0.5점) | 11 |
| 2.1 틀린 문항 0점 | 2(`scoreFor`), 7 |
| 2.2 문항 규칙 1~2, CLAUDE.md 문항 작성 규칙 1~10 | 2(`validateQuestions`), 3~6 |
| 3.1 화면 흐름(1단계, 2단계) | 7, 9 |
| 3.2 문제 화면 | 7 |
| 3.3 모드별 추가 요소 | 10, 11 |
| 3.4 결과 화면 | 8, 12, 14 |
| 3.5 틀린 문제 다시 풀기 | 12 |
| 3.6 순위표 | 13, 14 |
| 4.1 문항 형식 | 2, 3~6 |
| 4.2 기록 형식 | 13 |
| 5. script.js 구조, 데이터 오류 처리, 자체 점검 | 1, 2, 7, 8 |
| 6. 단계별 완료 기준 | 각 단계 끝 |
| 7. 검증 방법 | 전체 제약의 CHECK, 각 단계 끝의 직접 확인 항목 |
| 8. 범위 밖 | 해당 태스크 없음 |
