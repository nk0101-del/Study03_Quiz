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
  },

  // ---------- 세계지리 ----------
  {
    id: "geo-01",
    category: "세계지리",
    question: "오스트레일리아의 연방 수도는?",
    choices: ["캔버라", "시드니", "멜버른", "퍼스"],
    answer: 0,
    explanation: "캔버라는 오스트레일리아 연방의 수도로, 시드니에서 남서쪽으로 약 240km 떨어져 있다.",
    source: { name: "브리태니커 「Canberra」", url: "https://www.britannica.com/place/Canberra" }
  },
  {
    id: "geo-02",
    category: "세계지리",
    question: "네팔과 중국(티베트) 국경에 있는 에베레스트산이 속한 산맥은?",
    choices: ["히말라야산맥", "알프스산맥", "안데스산맥", "로키산맥"],
    answer: 0,
    explanation: "에베레스트산은 히말라야산맥의 네팔과 중국(티베트) 국경에 있다.",
    source: { name: "브리태니커 「Mount Everest」", url: "https://www.britannica.com/place/Mount-Everest" }
  },
  {
    id: "geo-03",
    category: "세계지리",
    question: "남아메리카 남쪽 끝에서 카리브해 연안까지 약 8,900km 이어지는 산계는?",
    choices: ["안데스산맥", "로키산맥", "우랄산맥", "아틀라스산맥"],
    answer: 0,
    explanation: "안데스산맥은 남아메리카 남쪽 끝에서 북쪽 카리브해 연안까지 약 8,900km 이어진다.",
    source: { name: "브리태니커 「Andes Mountains」", url: "https://www.britannica.com/place/Andes-Mountains" }
  },
  {
    id: "geo-04",
    category: "세계지리",
    question: "북아프리카의 거의 전부를 차지하는 사막은?",
    choices: ["사하라 사막", "고비 사막", "아타카마 사막", "칼라하리 사막"],
    answer: 0,
    explanation: "사하라 사막은 북아프리카의 거의 전부를 차지하며, 동서 길이가 약 4,800km다.",
    source: { name: "브리태니커 「Sahara」", url: "https://www.britannica.com/place/Sahara-desert-Africa" }
  },
  {
    id: "geo-05",
    category: "세계지리",
    question: "이집트의 수에즈 지협을 가로질러 지중해와 홍해를 잇는 운하는?",
    choices: ["수에즈 운하", "파나마 운하", "킬 운하", "코린트 운하"],
    answer: 0,
    explanation: "수에즈 운하는 이집트의 수에즈 지협을 가로질러 지중해와 홍해를 잇는다.",
    source: { name: "브리태니커 「Suez Canal」", url: "https://www.britannica.com/topic/Suez-Canal" }
  },
  {
    id: "geo-06",
    category: "세계지리",
    question: "적도(Equator) 위에 있어 나라 이름도 적도에서 따온 남아메리카 국가는?",
    choices: ["에콰도르", "콜롬비아", "페루", "볼리비아"],
    answer: 0,
    explanation: "에콰도르는 남아메리카 북서부에 있으며, 나라 이름은 적도(Equator)에서 따왔다.",
    source: { name: "브리태니커 「Ecuador」", url: "https://www.britannica.com/place/Ecuador" }
  },
  {
    id: "geo-07",
    category: "세계지리",
    question: "2026년 현재 국토 면적을 기준으로 세계에서 가장 큰 나라는?",
    choices: ["러시아", "캐나다", "중국", "미국"],
    answer: 0,
    explanation: "러시아는 면적이 세계 1위인 나라로, 2위 캐나다의 약 두 배에 이른다.",
    source: { name: "브리태니커 「Russia」", url: "https://www.britannica.com/place/Russia" }
  },
  {
    id: "geo-08",
    category: "세계지리",
    question: "독일 슈바르츠발트에서 시작해 10개 나라를 지나 흑해로 흘러드는 강은?",
    choices: ["다뉴브강", "라인강", "엘베강", "볼가강"],
    answer: 0,
    explanation: "다뉴브강은 독일 슈바르츠발트에서 시작해 10개 나라를 지나 흑해로 흘러든다.",
    source: { name: "브리태니커 「Danube River」", url: "https://www.britannica.com/place/Danube-River" }
  },
  {
    id: "geo-09",
    category: "세계지리",
    question: "빙하가 깎은 골짜기에 바닷물이 들어와 생긴, 내륙 깊이 뻗은 좁고 긴 만은?",
    choices: ["피오르", "석호", "삼각주", "사주"],
    answer: 0,
    explanation: "피오르는 빙하 골짜기가 바닷물에 잠겨 생긴, 내륙 깊이 뻗은 좁고 긴 만이다.",
    source: { name: "브리태니커 「Fjord」", url: "https://www.britannica.com/science/fjord" }
  },
  {
    id: "geo-10",
    category: "세계지리",
    question: "1884년부터 1984년까지 국제 표준 본초 자오선(경도 0°)이 지난 런던의 지역은?",
    choices: ["그리니치", "웨스트민스터", "캠든", "첼시"],
    answer: 0,
    explanation: "그리니치 자오선은 런던 그리니치를 지나는 경도 0°선으로, 1884~1984년 국제 표준이었다.",
    source: { name: "브리태니커 「Greenwich meridian」", url: "https://www.britannica.com/place/Greenwich-meridian" }
  }
];
