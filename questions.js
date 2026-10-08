// 2026-10-08 15:56 KST
// 상식 퀴즈 문항. 형식은 PRD.md 4.1절을 따른다.
const QUESTIONS = [
  // ---------- 한국사 ----------
  {
    id: "korhist-01",
    category: "한국사",
    question: "『삼국유사』에 따르면 아사달에 도읍하고 고조선(단군조선)을 세운 인물은?",
    choices: ["단군왕검", "주몽", "온조", "박혁거세"],
    answer: 0,
    explanation: "『삼국유사』는 단군왕검이 아사달에 도읍하고 나라를 열어 조선이라 했다고 전한다.",
    source: { name: "한국민족문화대백과사전 「단군조선」", url: "https://encykorea.aks.ac.kr/Article/E0013554" }
  },
  {
    id: "korhist-02",
    category: "한국사",
    question: "고구려의 옛 장수 대조영이 698년 동모산에서 세운 나라는?",
    choices: ["발해", "후백제", "동부여", "대가야"],
    answer: 0,
    explanation: "698년 고구려 옛 장수 대조영이 동모산에서 발해를 건국했다.",
    source: { name: "한국민족문화대백과사전 「발해」", url: "https://encykorea.aks.ac.kr/Article/E0021626" }
  },
  {
    id: "korhist-03",
    category: "한국사",
    question: "675년 매소성 전투와 676년 기벌포 전투에서 신라와 싸운 나라는?",
    choices: ["당", "수", "왜", "거란"],
    answer: 0,
    explanation: "나당전쟁은 신라와 당이 7년간 싸운 전쟁으로, 676년 기벌포 전투로 마무리되었다.",
    source: { name: "한국민족문화대백과사전 「나당전쟁」", url: "https://encykorea.aks.ac.kr/Article/E0011307" }
  },
  {
    id: "korhist-04",
    category: "한국사",
    question: "918년 궁예를 몰아내고 즉위하여 국호를 고려라 한 인물은?",
    choices: ["왕건", "견훤", "신검", "최영"],
    answer: 0,
    explanation: "왕건은 918년 6월 궁예를 내쫓고 즉위해 국호를 고려라 했다.",
    source: { name: "한국민족문화대백과사전 「태조」", url: "https://encykorea.aks.ac.kr/Article/E0059032" }
  },
  {
    id: "korhist-05",
    category: "한국사",
    question: "몽골의 침입을 물리치려는 염원으로 고려 때 새긴 팔만대장경판이 보관된 사찰은?",
    choices: ["해인사", "불국사", "부석사", "송광사"],
    answer: 0,
    explanation: "고려 고종 때 새긴 대장경판은 경상남도 합천 해인사가 소장하고 있다.",
    source: { name: "한국민족문화대백과사전 「합천 해인사 대장경판」", url: "https://encykorea.aks.ac.kr/Article/E0062711" }
  },
  {
    id: "korhist-06",
    category: "한국사",
    question: "1443년 훈민정음을 만들고 1446년 책으로 펴낸 조선의 왕은?",
    choices: ["세종", "태종", "세조", "성종"],
    answer: 0,
    explanation: "세종은 1443년 음력 12월 훈민정음을 만들었고, 1446년 음력 9월 책으로 펴냈다.",
    source: { name: "한국민족문화대백과사전 「한글」", url: "https://encykorea.aks.ac.kr/Article/E0061508" }
  },
  {
    id: "korhist-07",
    category: "한국사",
    question: "1592년 한산도대첩에서 학익진으로 일본 수군을 무찌른 전라좌수사는?",
    choices: ["이순신", "권율", "김시민", "곽재우"],
    answer: 0,
    explanation: "1592년 7월 전라좌수사 이순신이 이끈 조선 수군이 학익진으로 일본 수군 주력을 무찔렀다.",
    source: { name: "한국민족문화대백과사전 「한산도대첩」", url: "https://encykorea.aks.ac.kr/Article/E0061676" }
  },
  {
    id: "korhist-08",
    category: "한국사",
    question: "전라도 강진에서 귀양살이하던 중 『목민심서』를 지은 실학자는?",
    choices: ["정약용", "박지원", "유형원", "이익"],
    answer: 0,
    explanation: "『목민심서』는 정약용이 강진 유배 중 집필해 1818년에 완성한 책이다.",
    source: { name: "한국민족문화대백과사전 「목민심서」", url: "https://encykorea.aks.ac.kr/Article/E0018631" }
  },
  {
    id: "korhist-09",
    category: "한국사",
    question: "3월 1일을 기해 전국에서 독립만세운동인 3·1운동이 일어난 해는?",
    choices: ["1919년", "1910년", "1926년", "1945년"],
    answer: 0,
    explanation: "3·1운동은 1919년 3월 1일을 기해 일어난 거족적인 독립만세운동이다.",
    source: { name: "한국민족문화대백과사전 「3·1운동」", url: "https://encykorea.aks.ac.kr/Article/E0026772" }
  },
  {
    id: "korhist-10",
    category: "한국사",
    question: "1919년 4월 11일 대한민국임시정부가 수립된 도시는?",
    choices: ["상하이", "충칭", "베이징", "블라디보스토크"],
    answer: 0,
    explanation: "대한민국임시정부는 1919년 4월 11일 중국 상하이에서 수립되었다.",
    source: { name: "한국민족문화대백과사전 「대한민국 임시정부 수립 기념일」", url: "https://encykorea.aks.ac.kr/Article/E0080590" }
  }
];
