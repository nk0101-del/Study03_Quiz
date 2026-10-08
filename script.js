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

function init() {
  if (new URLSearchParams(location.search).has("test")) showSelfTest();
  showScreen("screen-start");
}

// ---------- 점검 항목 ----------

check("자체 점검 틀이 동작함", () => assertEqual(typeof runSelfTest, "function"));

if (typeof document !== "undefined") init();
