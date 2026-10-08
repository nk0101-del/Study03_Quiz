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
  },

  // ---------- 과학 ----------
  {
    id: "sci-01",
    category: "과학",
    question: "원자 번호가 1인 원소는?",
    choices: ["수소", "헬륨", "리튬", "탄소"],
    answer: 0,
    explanation: "수소는 원자 번호가 1이고 원자량이 약 1.008인 원소다.",
    source: { name: "브리태니커 「Hydrogen」", url: "https://www.britannica.com/science/hydrogen" }
  },
  {
    id: "sci-02",
    category: "과학",
    question: "녹색 식물이 빛 에너지를 이용해 물과 이산화탄소로 산소와 유기물을 만드는 과정은?",
    choices: ["광합성", "세포 호흡", "발효", "증산 작용"],
    answer: 0,
    explanation: "광합성은 빛 에너지로 물과 이산화탄소를 산소와 에너지가 풍부한 유기물로 바꾸는 과정이다.",
    source: { name: "브리태니커 「Photosynthesis」", url: "https://www.britannica.com/science/photosynthesis" }
  },
  {
    id: "sci-03",
    category: "과학",
    question: "1953년 DNA가 이중 나선 구조임을 밝힌 두 과학자는?",
    choices: ["왓슨과 크릭", "멘델과 다윈", "퀴리 부부", "보어와 러더퍼드"],
    answer: 0,
    explanation: "1953년 왓슨과 크릭은 프랭클린과 윌킨스의 연구에 힘입어 DNA의 이중 나선 구조를 밝혔다.",
    source: { name: "브리태니커 「DNA」", url: "https://www.britannica.com/science/DNA" }
  },
  {
    id: "sci-04",
    category: "과학",
    question: "포도당을 분해해 세포가 쓸 에너지(ATP)를 만들어 '세포의 발전소'라 불리는 세포 소기관은?",
    choices: ["미토콘드리아", "리보솜", "골지체", "액포"],
    answer: 0,
    explanation: "미토콘드리아는 포도당을 분해해 ATP를 만들며 '세포의 발전소'라 불린다.",
    source: { name: "브리태니커 「Mitochondrion」", url: "https://www.britannica.com/science/mitochondrion" }
  },
  {
    id: "sci-05",
    category: "과학",
    question: "외부에서 힘이 작용하지 않으면 정지한 물체는 계속 정지하고, 움직이는 물체는 등속 직선 운동을 계속한다는 법칙은?",
    choices: ["뉴턴의 운동 제1법칙", "뉴턴의 운동 제2법칙", "뉴턴의 운동 제3법칙", "만유인력의 법칙"],
    answer: 0,
    explanation: "뉴턴의 운동 제1법칙에 따르면 힘이 작용하지 않는 물체는 정지 상태나 등속 직선 운동을 유지한다.",
    source: { name: "브리태니커 「Newton's laws of motion」", url: "https://www.britannica.com/science/Newtons-laws-of-motion" }
  },
  {
    id: "sci-06",
    category: "과학",
    question: "2026년 현재 태양계 행성 8개 가운데 태양에서 가장 가까운 행성은?",
    choices: ["수성", "금성", "지구", "화성"],
    answer: 0,
    explanation: "NASA에 따르면 수성은 태양계 행성 가운데 태양에 가장 가까운 행성이다.",
    source: { name: "NASA 「Mercury」", url: "https://science.nasa.gov/mercury/" }
  },
  {
    id: "sci-07",
    category: "과학",
    question: "지구의 겉껍질인 암석권의 움직임으로 산맥 형성, 화산, 지진을 설명하는 이론은?",
    choices: ["판 구조론", "빅뱅 이론", "진화론", "상대성 이론"],
    answer: 0,
    explanation: "판 구조론은 암석권의 움직임으로 산맥 형성, 화산, 지진을 한데 설명하는 이론이다.",
    source: { name: "브리태니커 「Plate tectonics」", url: "https://www.britannica.com/science/plate-tectonics" }
  },
  {
    id: "sci-08",
    category: "과학",
    question: "순수한 물처럼 산성도 염기성도 아닌 중성 용액의 pH는?",
    choices: ["7", "0", "1", "14"],
    answer: 0,
    explanation: "pH 7은 중성이며, 7보다 작으면 산성, 7보다 크면 염기성이다.",
    source: { name: "브리태니커 「pH」", url: "https://www.britannica.com/science/pH" }
  },
  {
    id: "sci-09",
    category: "과학",
    question: "드라이아이스처럼 고체가 액체를 거치지 않고 바로 기체로 바뀌는 현상은?",
    choices: ["승화", "융해", "응결", "기화"],
    answer: 0,
    explanation: "승화는 고체가 액체를 거치지 않고 기체가 되는 현상으로, 드라이아이스가 그 예다.",
    source: { name: "브리태니커 「Sublimation」", url: "https://www.britannica.com/science/sublimation-phase-change" }
  },
  {
    id: "sci-10",
    category: "과학",
    question: "적혈구 속에서 철 원자로 산소와 결합해 조직까지 산소를 나르는 단백질은?",
    choices: ["헤모글로빈", "인슐린", "케라틴", "콜라겐"],
    answer: 0,
    explanation: "헤모글로빈은 적혈구 속 철을 함유한 단백질로, 산소를 조직까지 운반한다.",
    source: { name: "브리태니커 「Hemoglobin」", url: "https://www.britannica.com/science/hemoglobin" }
  }
];
