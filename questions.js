// 2026-10-08 15:56 KST
// 상식 퀴즈 문항. 형식은 PRD.md 4.1절을 따른다.
const QUESTIONS = [
  // ---------- 한국사 ----------
  {
    id: "korhist-01",
    category: "한국사",
    question: "『삼국유사』에 따르면 고조선(단군조선)을 세운 인물은?",
    choices: ["단군왕검", "주몽", "온조", "박혁거세"],
    answer: 0,
    explanation: "『삼국유사』는 단군왕검이 나라를 열어 이름을 조선이라 했다고 전한다.",
    source: { name: "한국민족문화대백과사전 「단군조선」", url: "https://encykorea.aks.ac.kr/Article/E0013554" }
  },
  {
    id: "korhist-02",
    category: "한국사",
    question: "698년 대조영이 동모산에서 세운 나라는?",
    choices: ["발해", "후백제", "동부여", "대가야"],
    answer: 0,
    explanation: "발해는 698년 대조영이 동모산에서 세운 나라로, 처음 이름은 진국이었다.",
    source: { name: "한국민족문화대백과사전 「발해」", url: "https://encykorea.aks.ac.kr/Article/E0021626" }
  },
  {
    id: "korhist-03",
    category: "한국사",
    question: "675년 매소성 전투와 676년 기벌포 전투에서 신라와 싸운 나라는?",
    choices: ["당", "수", "왜", "거란"],
    answer: 0,
    explanation: "나당전쟁은 670년부터 676년까지 신라와 당이 싸운 전쟁으로, 676년 기벌포 전투로 마무리되었다.",
    source: { name: "한국민족문화대백과사전 「나당전쟁」", url: "https://encykorea.aks.ac.kr/Article/E0011307" }
  },
  {
    id: "korhist-04",
    category: "한국사",
    question: "918년 궁예를 몰아내고 즉위하여 국호를 고려라 한 인물은?",
    choices: ["왕건", "견훤", "신검", "양길"],
    answer: 0,
    explanation: "왕건은 918년 궁예를 내쫓고 즉위해 국호를 고려라 했다.",
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
    explanation: "1592년 음력 7월 전라좌수사 이순신이 이끈 조선 수군이 학익진으로 일본 수군 주력을 무찔렀다.",
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
    explanation: "캔버라는 오스트레일리아 연방의 수도로, 남동부의 오스트레일리아 수도 특별구에 있다.",
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
    question: "남아메리카 남쪽 끝에서 북쪽 카리브해 연안까지 이어지는 산계는?",
    choices: ["안데스산맥", "로키산맥", "우랄산맥", "아틀라스산맥"],
    answer: 0,
    explanation: "안데스산맥은 남아메리카 남쪽 끝에서 북쪽 카리브해 연안까지 끊이지 않고 이어진다.",
    source: { name: "브리태니커 「Andes Mountains」", url: "https://www.britannica.com/place/Andes-Mountains" }
  },
  {
    id: "geo-04",
    category: "세계지리",
    question: "북아프리카의 넓은 지역을 차지하는 사막은?",
    choices: ["사하라 사막", "고비 사막", "아타카마 사막", "칼라하리 사막"],
    answer: 0,
    explanation: "사하라 사막은 북아프리카의 넓은 지역을 차지하며, 동서 길이가 약 4,800km다.",
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
    explanation: "러시아는 국토 면적이 세계에서 가장 넓은 나라이며, 2위는 캐나다다.",
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
    question: "1884년 국제 자오선 회의에서 본초 자오선(경도 0°)이 지나는 곳으로 정한 런던의 지역은?",
    choices: ["그리니치", "웨스트민스터", "캠든", "첼시"],
    answer: 0,
    explanation: "1884년 국제 회의는 런던 그리니치 왕립 천문대를 지나는 자오선을 경도 0°의 기준으로 정했다.",
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
    choices: ["왓슨과 크릭", "멘델과 다윈", "퀴리와 베크렐", "보어와 러더퍼드"],
    answer: 0,
    explanation: "1953년 왓슨과 크릭은 프랭클린과 윌킨스의 연구에 힘입어 DNA의 이중 나선 구조를 밝혔다.",
    source: { name: "브리태니커 「DNA」", url: "https://www.britannica.com/science/DNA" }
  },
  {
    id: "sci-04",
    category: "과학",
    question: "세포가 쓸 에너지(ATP)를 만들어 '세포의 발전소'라 불리는 세포 소기관은?",
    choices: ["미토콘드리아", "리보솜", "골지체", "액포"],
    answer: 0,
    explanation: "미토콘드리아는 세포가 쓰는 에너지인 ATP를 만들어 '세포의 발전소'라 불린다.",
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
  },

  // ---------- 예술과 문화 ----------
  {
    id: "art-01",
    category: "예술과 문화",
    question: "파리 루브르 박물관에 걸려 있는 유화 「모나리자」를 그린 화가는?",
    choices: ["레오나르도 다빈치", "미켈란젤로", "라파엘로", "보티첼리"],
    answer: 0,
    explanation: "「모나리자」는 레오나르도 다빈치가 포플러 나무판에 그린 유화로, 루브르 박물관에 있다.",
    source: { name: "브리태니커 「Mona Lisa」", url: "https://www.britannica.com/topic/Mona-Lisa-painting" }
  },
  {
    id: "art-02",
    category: "예술과 문화",
    question: "1889년 프랑스 생레미의 요양원에 머물며 「별이 빛나는 밤」을 그린 화가는?",
    choices: ["빈센트 반 고흐", "폴 고갱", "클로드 모네", "폴 세잔"],
    answer: 0,
    explanation: "반 고흐는 1889년 생레미 근처 요양원에 머무는 동안 「별이 빛나는 밤」을 그렸다.",
    source: { name: "브리태니커 「The Starry Night」", url: "https://www.britannica.com/topic/The-Starry-Night" }
  },
  {
    id: "art-03",
    category: "예술과 문화",
    question: "마지막 악장에서 합창단이 실러의 시 「환희의 송가」를 부르는 교향곡 제9번의 작곡가는?",
    choices: ["베토벤", "모차르트", "하이든", "브람스"],
    answer: 0,
    explanation: "베토벤의 교향곡 제9번은 마지막 악장에서 실러의 「환희의 송가」를 합창으로 부른다.",
    source: { name: "브리태니커 「Symphony No. 9 in D Minor」", url: "https://www.britannica.com/topic/Symphony-No-9-in-D-Minor" }
  },
  {
    id: "art-04",
    category: "예술과 문화",
    question: "1599~1601년 무렵에 쓰인 5막 비극 『햄릿』의 작가는?",
    choices: ["윌리엄 셰익스피어", "크리스토퍼 말로", "벤 존슨", "존 밀턴"],
    answer: 0,
    explanation: "『햄릿』은 윌리엄 셰익스피어가 1599~1601년 무렵에 쓴 5막 비극이다.",
    source: { name: "브리태니커 「Hamlet」", url: "https://www.britannica.com/topic/Hamlet-by-Shakespeare" }
  },
  {
    id: "art-05",
    category: "예술과 문화",
    question: "근대 소설의 원형으로 꼽히는 『돈키호테』의 작가는?",
    choices: ["미겔 데 세르반테스", "로페 데 베가", "단테 알리기에리", "조반니 보카치오"],
    answer: 0,
    explanation: "『돈키호테』는 미겔 데 세르반테스의 소설로, 근대 소설의 원형으로 꼽힌다.",
    source: { name: "브리태니커 「Don Quixote」", url: "https://www.britannica.com/topic/Don-Quixote-novel" }
  },
  {
    id: "art-06",
    category: "예술과 문화",
    question: "1877년 모스크바 볼쇼이 극장에서 초연된 발레 「백조의 호수」의 작곡가는?",
    choices: ["차이콥스키", "스트라빈스키", "라흐마니노프", "림스키코르사코프"],
    answer: 0,
    explanation: "「백조의 호수」는 러시아 작곡가 차이콥스키의 발레로, 1877년 볼쇼이 극장에서 초연되었다.",
    source: { name: "브리태니커 「Swan Lake」", url: "https://www.britannica.com/topic/Swan-Lake-ballet-by-Tchaikovsky" }
  },
  {
    id: "art-07",
    category: "예술과 문화",
    question: "무굴 황제 샤자한이 왕비 뭄타즈 마할의 무덤으로 인도 아그라에 지은 건축물은?",
    choices: ["타지마할", "앙코르와트", "보로부두르", "쿠트브 미나르"],
    answer: 0,
    explanation: "타지마할은 무굴 황제 샤자한이 왕비 뭄타즈 마할의 무덤으로 아그라에 세웠다.",
    source: { name: "브리태니커 「Taj Mahal」", url: "https://www.britannica.com/topic/Taj-Mahal" }
  },
  {
    id: "art-08",
    category: "예술과 문화",
    question: "1883년 건축가 가우디가 설계를 맡은 스페인 바르셀로나의 성당은?",
    choices: ["사그라다 파밀리아", "노트르담 대성당", "쾰른 대성당", "성 베드로 대성당"],
    answer: 0,
    explanation: "바르셀로나의 사그라다 파밀리아는 1883년 카탈루냐 건축가 가우디가 설계를 맡았다.",
    source: { name: "브리태니커 「Sagrada Família」", url: "https://www.britannica.com/topic/Sagrada-Familia" }
  },
  {
    id: "art-09",
    category: "예술과 문화",
    question: "소리꾼 한 명이 북 치는 고수와 함께 노래, 말, 몸짓으로 긴 이야기를 펼치는 한국 전통 음악은?",
    choices: ["판소리", "민요", "정가", "산조"],
    answer: 0,
    explanation: "판소리는 소리꾼과 고수가 노래, 말, 몸짓으로 이야기를 펼치는 음악으로, 유네스코 인류무형유산이다.",
    source: { name: "유네스코 무형유산 「Pansori epic chant」", url: "https://ich.unesco.org/en/RL/pansori-epic-chant-00070" }
  },
  {
    id: "art-10",
    category: "예술과 문화",
    question: "조선 왕실의 조상을 모신 유교 사당으로, 1995년 유네스코 세계유산에 등재된 곳은?",
    choices: ["종묘", "경복궁", "창덕궁", "수원 화성"],
    answer: 0,
    explanation: "종묘는 조선 왕실의 조상을 모신 유교 사당으로, 1995년 유네스코 세계유산에 등재되었다.",
    source: { name: "유네스코 세계유산 「Jongmyo Shrine」", url: "https://whc.unesco.org/en/list/738" }
  }
];
