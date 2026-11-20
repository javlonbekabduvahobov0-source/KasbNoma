export interface CareerRole {
  title: string;
  sector: "Ta'lim va Pedagogika" | "IT va Texnologiya" | "Moliya va Biznes" | "Muhandislik va Tibbiyot";
  degreePath: string;
  entryIncomeMln: string;
  seniorIncomeMln: string;
  workloadNote: string;
}

export interface IncomeStage {
  stage: string;
  label: string;
  minMln: number;
  maxMln: number;
  note: string;
}

export interface SubjectPathway {
  id: string;
  name: string;
  tagline: string;
  interestHook: string;
  realWorldFacts: string[];
  keyUniversities: string[];
  dtmBlock: string;
  avgGrantScore: string;
  instituteOptions: string;
  universityOptions: string;
  bachelorOutcome: string;
  masterOutcome: string;
  roles: CareerRole[];
  incomeStages: IncomeStage[];
}

export const SUBJECT_PATHWAYS: SubjectPathway[] = [
  {
    id: "matematika",
    name: "Matematika",
    tagline: "Eng ko'p eshik ochadigan fundamental fan: maktabdan Data Science va moliyagacha",
    interestHook: "Sun'iy intellekt (ChatGPT/Gemini), bank tizimlari, kriptografiya va kosmik raketalarning barchasi matematika algoritmlari asosida ishlaydi.",
    realWorldFacts: [
      "Matematika Milliy sertifikati bilan OTM imtihonida kirishdanoq maksimal ball (93/93) olish va keyin maktabda +20–50% ustama bilan ishlash mumkin.",
      "Jahonda eng yuqori maoshli TOP-10 kasbning 7 tasi (Data Scientist, Quant, AI Engineer, Aktuariy) kuchli matematikaga tayanadi.",
      "O'zbekistonda kuchli matematika repetitori haftasiga 3–4 ta guruh bilan oyiga 20–40 mln so'mgacha daromad topadi.",
    ],
    keyUniversities: ["O'zMU", "TATU", "TDIU", "Yangi O'zbekiston Univ", "TDPU (Nizomiy)"],
    dtmBlock: "1-fan: Matematika (3.1 ball) · 2-fan: Fizika yoki Ingliz tili (2.1 ball) · Majburiy fanlar",
    avgGrantScore: "152 – 178 ball",
    instituteOptions: "TDPU (Nizomiy), viloyat Pedagogika institutlari — bevosita maktab va akademik litsey o'qituvchisi",
    universityOptions: "O'zMU, TATU, TDIU, Yangi O'zbekiston universiteti — amaliy matematika, Data Science, moliya, AI",
    bachelorOutcome: "Bakalavr (4 yil) bilan davlat/xususiy maktabda 1–1.5 stavka (20–30 soat) dars berish, bank/IT da Junior tahlilchi bo'lish mumkin.",
    masterOutcome: "Magistratura (2 yil) OTMda dars berish, ilmiy tadqiqot, xalqaro kompaniyalarda Senior/Lead tahlilchi bo'lish imkonini ochadi.",
    roles: [
      {
        title: "Matematika o'qituvchisi (Maktab / Litsey)",
        sector: "Ta'lim va Pedagogika",
        degreePath: "Pedagogika instituti yoki Universitet",
        entryIncomeMln: "3.8 – 6.2 mln",
        seniorIncomeMln: "12.0 – 22.0 mln",
        workloadNote: "1 stavka = 20 soat, max 1.5 stavka = 30 soat + Oliy toifa va Milliy sertifikat ustamasi",
      },
      {
        title: "Data Analyst / BI Mutaxassis",
        sector: "IT va Texnologiya",
        degreePath: "Universitet (Amaliy matematika / KI)",
        entryIncomeMln: "6.0 – 10.0 mln",
        seniorIncomeMln: "18.0 – 38.0 mln",
        workloadNote: "To'liq stavka ofis yoki masofaviy; SQL, Python, Power BI talab qilinadi",
      },
      {
        title: "Aktuariy / Risk va Moliya tahlilchisi",
        sector: "Moliya va Biznes",
        degreePath: "Universitet (Matematika / Moliya)",
        entryIncomeMln: "7.0 – 11.0 mln",
        seniorIncomeMln: "20.0 – 40.0 mln",
        workloadNote: "Banklar, sug'urta va fintex kompaniyalarida yuqori talab",
      },
      {
        title: "Repetitor / O'quv markaz o'qituvchisi",
        sector: "Ta'lim va Pedagogika",
        degreePath: "Bakalavr (3-kursdan boshlash mumkin)",
        entryIncomeMln: "5.0 – 9.0 mln",
        seniorIncomeMln: "15.0 – 45.0+ mln",
        workloadNote: "Guruh soni va natijadorlikka qarab cheklanmagan daromad",
      },
    ],
    incomeStages: [
      { stage: "3–4-kurs stajyor", label: "Talabalik davri", minMln: 2.5, maxMln: 5.5, note: "Yordamchi repetitor yoki IT stajirovka" },
      { stage: "Bakalavr (1-yil)", label: "Mutaxassis / Junior", minMln: 4.0, maxMln: 8.5, note: "Maktabda 20–30 soat dars yoki Junior tahlilchi" },
      { stage: "2–1-toifa / Middle", label: "3–4 yil tajriba", minMln: 7.5, maxMln: 15.0, note: "Toifa + sertifikat ustamasi yoki Middle Data" },
      { stage: "Oliy toifa / Senior", label: "5+ yil cho'qqi", minMln: 14.0, maxMln: 35.0, note: "Prezident maktabi, Vazir jamg'armasi yoki Senior IT/Moliya" },
    ],
  },
  {
    id: "informatika",
    name: "Informatika va IT",
    tagline: "Mahalliy va xalqaro masofaviy bozorga eng tez chiqadigan yo'nalish",
    interestHook: "Toshkentda yoki viloyatda yashab turib AQSh va Yevropa kompaniyalariga masofadan dastur yozish va dollarda maosh olish imkoniyati.",
    realWorldFacts: [
      "IT sohasida 3-kurs talabalari ham amaliy loyihalar qilib, oyiga 5–10 mln so'm topishni boshlaydi.",
      "O'zbekiston maktablarida xalqaro IT sertifikatiga (Google/Microsoft/Cisco) ega Informatika o'qituvchilariga qo'shimcha ustamalar beriladi.",
      "Sun'iy intellekt va kiberxavfsizlik mutaxassislariga talab har yili 30%+ o'smoqda.",
    ],
    keyUniversities: ["TATU", "INHA Toshkent", "Amity", "Yangi O'zbekiston Univ", "O'zMU"],
    dtmBlock: "1-fan: Matematika (3.1 ball) · 2-fan: Informatika / Fizika (2.1 ball) · Majburiy fanlar",
    avgGrantScore: "158 – 184 ball",
    instituteOptions: "Pedagogika institutlari (Informatika o'qituvchisi), Texnika institutlari (Tizim muhandisi)",
    universityOptions: "TATU, INHA, Amity, New Uzbekistan Univ, O'zMU — Software Engineering, Kiberxavfsizlik, AI",
    bachelorOutcome: "3-kursdanoq real IT kompaniyalarda stajyor/Junior bo'lib ishlash yoki maktabda Informatika darsi (20–30 soat) berish mumkin.",
    masterOutcome: "AI tadqiqotchisi, Senior arxitektor, OTM dotsenti va xalqaro R&D jamoalarida yetakchi muhandis.",
    roles: [
      {
        title: "Backend / Frontend / Mobile Dasturchi",
        sector: "IT va Texnologiya",
        degreePath: "Universitet + kuchli portfolio",
        entryIncomeMln: "5.5 – 10.0 mln",
        seniorIncomeMln: "22.0 – 50.0+ mln",
        workloadNote: "Masofaviy USD kontrakti orqali daromad bir necha baravar oshishi mumkin",
      },
      {
        title: "Informatika va IT fani o'qituvchisi",
        sector: "Ta'lim va Pedagogika",
        degreePath: "Pedagogika instituti / TATU",
        entryIncomeMln: "4.0 – 6.5 mln",
        seniorIncomeMln: "11.0 – 19.0 mln",
        workloadNote: "Xalqaro IT sertifikati (Google, Microsoft, Cisco) bo'lsa qo'shimcha ustamalar bor",
      },
      {
        title: "Kiberxavfsizlik va Tarmoq mutaxassisi",
        sector: "IT va Texnologiya",
        degreePath: "Universitet (Axborot xavfsizligi)",
        entryIncomeMln: "7.0 – 12.0 mln",
        seniorIncomeMln: "20.0 – 42.0 mln",
        workloadNote: "Banklar, davlat tizimlari va yirik korporatsiyalarda doimiy talab",
      },
    ],
    incomeStages: [
      { stage: "2–3-kurs Intern", label: "Amaliyotchi", minMln: 2.0, maxMln: 5.0, note: "IT Park rezidentlarida stajirovka" },
      { stage: "Bakalavr / Junior", label: "Ilk rasmiy ish", minMln: 5.5, maxMln: 10.5, note: "Junior dasturchi yoki maktab + kurslar" },
      { stage: "Middle / 1-toifa", label: "2–4 yil tajriba", minMln: 12.0, maxMln: 24.0, note: "Mustaqil loyihalar va jamoaviy ish" },
      { stage: "Senior / Tech Lead", label: "4+ yil / Eksport", minMln: 24.0, maxMln: 50.0, note: "Xalqaro kompaniyalar va frilans" },
    ],
  },
  {
    id: "ingliz-tili",
    name: "Ingliz tili va Filologiya",
    tagline: "IELTS / CEFR orqali maktabda +50% ustama va xalqaro biznesga yo'l",
    interestHook: "IELTS 7.0+ (C1) sertifikati nafaqat chet el grantlariga eshik ochadi, balki davlat maktabida birinchi oydanoq maoshingizni 1.5 baravar oshiradi.",
    realWorldFacts: [
      "Davlat maktabida C1 sertifikati bor ingliz tili o'qituvchisiga boshqa fanlarga nisbatan darhol +50% ustama to'lanadi.",
      "Ingliz tilini biladigan dasturchi, moliyachi yoki muhandis bilmaydigan hamkasbidan o'rtacha 2 baravar ko'p maosh oladi.",
      "IELTS instruktorlari va sinxron tarjimonlar xususiy sektorda eng barqaror talabga ega.",
    ],
    keyUniversities: ["O'zDJTU", "SamDChTI", "Vestminster (WIUT)", "Webster", "TDPU"],
    dtmBlock: "1-fan: Ingliz tili (3.1 ball) · 2-fan: Ona tili va adabiyot (2.1 ball) · Majburiy fanlar",
    avgGrantScore: "162 – 186 ball",
    instituteOptions: "O'zDJTU (Universitet maqomida), Pedagogika institutlari — maktab o'qituvchisi va tarjimonlik",
    universityOptions: "O'zDJTU, Samarqand DChTI, Vestminster, Webster — xalqaro jurnalistika, TESOL, sinxron tarjima",
    bachelorOutcome: "C1 (IELTS 7.0+) sertifikati bilan davlat maktabida boshlanishidanoq +50% ustama olish mumkin!",
    masterOutcome: "OTM o'qituvchisi, xalqaro tashkilotlar koordinatori, IELTS imtihon mutaxassisi.",
    roles: [
      {
        title: "Ingliz tili o'qituvchisi (C1 / IELTS 7.0+ bilan)",
        sector: "Ta'lim va Pedagogika",
        degreePath: "Filologiya / Pedagogika",
        entryIncomeMln: "5.5 – 8.0 mln",
        seniorIncomeMln: "13.0 – 20.0 mln",
        workloadNote: "C1 sertifikati darhol +50% ustama beradi; Oliy toifa bilan daromad yanada oshadi",
      },
      {
        title: "IELTS Instruktor (Xususiy markaz)",
        sector: "Ta'lim va Pedagogika",
        degreePath: "Bakalavr + IELTS 7.5–8.5",
        entryIncomeMln: "7.0 – 12.0 mln",
        seniorIncomeMln: "18.0 – 35.0 mln",
        workloadNote: "Har bir o'quvchi to'lovidan foiz (40–60%) yoki yuqori soatbay haq",
      },
      {
        title: "Sinxron tarjimon / Xalqaro menejer",
        sector: "Moliya va Biznes",
        degreePath: "Universitet (Tarjima nazariyasi)",
        entryIncomeMln: "6.0 – 10.0 mln",
        seniorIncomeMln: "15.0 – 32.0 mln",
        workloadNote: "Logistika, eksport kompaniyalari va xalqaro loyihalar",
      },
    ],
    incomeStages: [
      { stage: "IELTS 6.5–7.0 Talaba", label: "Assistant teacher", minMln: 3.0, maxMln: 6.0, note: "O'quv markazlarda speaking club va yordamchi" },
      { stage: "Bakalavr + C1", label: "Ustama bilan start", minMln: 5.5, maxMln: 9.0, note: "Maktabda +50% C1 ustamasi bilan" },
      { stage: "1-toifa / IELTS 8.0", label: "Tajribali ustoz", minMln: 10.0, maxMln: 18.0, note: "Toifa + sertifikat + guruh darslari" },
      { stage: "Oliy toifa / Akademik rahbar", label: "Top daraja", minMln: 16.0, maxMln: 35.0, note: "Xususiy maktablar va shaxsiy o'quv markaz" },
    ],
  },
  {
    id: "fizika",
    name: "Fizika va Muhandislik",
    tagline: "Energetika, qurilish, aviatsiya, robototexnika va aniq fanlar pedagogikasi",
    interestHook: "O'zbekistonda qurilayotgan yirik quyosh va shamol elektr stansiyalari, elektromobil zavodlari va metro loyihalari fizika-muhandislarga tayanadi.",
    realWorldFacts: [
      "Fizika yo'nalishlarida raqobat boshqa gumanitar fanlarga qaraganda pastroq, shuning uchun davlat grantiga kirish imkoniyati yuqori.",
      "Yashil energetika va sanoat avtomatlashtirish muhandislari xalqaro loyihalarda $1,500–$3,000 gacha oylik olmoqda.",
      "Fizika milliy sertifikati ham OTM kirishda maximal ball, ham maktabda +20–50% ustama beradi.",
    ],
    keyUniversities: ["TDTU (Texnika univ)", "Turin Politexnika", "O'zMU", "TIQXMMI", "Toshkent Kimyo-Texnologiya"],
    dtmBlock: "1-fan: Fizika yoki Matematika (3.1 ball) · 2-fan: Matematika / Fizika (2.1 ball) · Majburiy fanlar",
    avgGrantScore: "135 – 168 ball",
    instituteOptions: "Politexnika va Pedagogika institutlari — muhandis-energetik, qurilish texnologi, maktab o'qituvchisi",
    universityOptions: "O'zMU, TDTU (Texnika universiteti), Turin Politexnika — yadro fizikasi, qayta tiklanuvchi energiya, mexatronika",
    bachelorOutcome: "Zavodlar, quyosh/elektr stansiyalari, qurilish kompaniyalarida muhandis yoki maktabda Fizika o'qituvchisi.",
    masterOutcome: "Loyiha bosh muhandisi, ilmiy laboratoriya rahbari, xalqaro energetika loyihalari eksperti.",
    roles: [
      {
        title: "Energetika va Quyosh stansiyalari muhandisi",
        sector: "Muhandislik va Tibbiyot",
        degreePath: "Texnika universiteti / Politexnika",
        entryIncomeMln: "5.5 – 9.0 mln",
        seniorIncomeMln: "15.0 – 30.0 mln",
        workloadNote: "Yashil energetika va sanoat korxonalarida talab keskin oshmoqda",
      },
      {
        title: "Fizika fani o'qituvchisi",
        sector: "Ta'lim va Pedagogika",
        degreePath: "Pedagogika instituti / O'zMU",
        entryIncomeMln: "3.8 – 6.2 mln",
        seniorIncomeMln: "12.0 – 20.0 mln",
        workloadNote: "Fizika bo'yicha Milliy sertifikat +20–50% ustama va DTM tayyorlov imkoniyati",
      },
      {
        title: "Mexatronika va Avtomatlashtirish muhandisi",
        sector: "Muhandislik va Tibbiyot",
        degreePath: "Turin Politexnika / TDTU",
        entryIncomeMln: "6.5 – 11.0 mln",
        seniorIncomeMln: "18.0 – 35.0 mln",
        workloadNote: "Avtomobilsozlik, ishlab chiqarish liniyalari va robototexnika",
      },
    ],
    incomeStages: [
      { stage: "Amaliyotchi muhandis", label: "3–4-kurs", minMln: 2.5, maxMln: 5.0, note: "Korxona va laboratoriyalarda stajirovka" },
      { stage: "Bakalavr muhandis / ustoz", label: "Boshlang'ich", minMln: 4.2, maxMln: 8.5, note: "1–1.5 stavka dars yoki kichik muhandis" },
      { stage: "Yetakchi muhandis / 1-toifa", label: "3–5 yil", minMln: 9.0, maxMln: 17.0, note: "Sertifikatlar va loyiha boshqaruvi" },
      { stage: "Bosh muhandis / Oliy toifa", label: "5+ yil", minMln: 16.0, maxMln: 34.0, note: "Yirik energetika yoki xususiy ta'lim" },
    ],
  },
  {
    id: "kimyo-biologiya",
    name: "Kimyo va Biologiya",
    tagline: "Tibbiyot, farmatsevtika, biotexnologiya va yuqori talabli fan o'qituvchiligi",
    interestHook: "Tibbiyot, genetika, zamonaviy dori yaratish va diagnostika laboratoriyalari — inson hayotini saqlab qoluvchi eng obro'li sohalar.",
    realWorldFacts: [
      "Tibbiyot oliygohlariga kirish uchun raqobat juda kuchli bo'lgani sababli, Kimyo-Biologiya repetitorlariga talab yil davomida uzilmaydi.",
      "Biotexnologiya va farmatsevtika yo'nalishini bitirganlar 4 yilda ishga chiqadi (shifokorlikda esa 6 yil + ordinatura).",
      "Kimyo va Biologiya milliy sertifikatlari OTM ga kirishda maksimal ballni kafolatlaydi.",
    ],
    keyUniversities: ["Toshkent Tibbiyot Akademiyasi", "ToshPTI", "Farmatsevtika instituti", "O'zMU", "SamDTU"],
    dtmBlock: "1-fan: Biologiya / Kimyo (3.1 ball) · 2-fan: Kimyo / Biologiya (2.1 ball) · Majburiy fanlar",
    avgGrantScore: "155 – 185 ball",
    instituteOptions: "Tibbiyot institutlari (6 yil), Farmatsevtika instituti, Pedagogika institutlari",
    universityOptions: "O'zMU (Biotexnologiya, Biokimyo), Kimyo-texnologiya universiteti — laboratoriya va sanoat",
    bachelorOutcome: "Pedagogika/Biotexnologiyada 4 yilda ishga chiqiladi; Tibbiyotda esa 6 yil bakalavr + 2–3 yil ordinatura talab qilinadi.",
    masterOutcome: "Tor soha shifokor-mutaxassisi, farmatsevtika texnologi, ilmiy tadqiqotchi.",
    roles: [
      {
        title: "Kimyo / Biologiya ustozi va DTM repetitori",
        sector: "Ta'lim va Pedagogika",
        degreePath: "Pedagogika instituti / O'zMU",
        entryIncomeMln: "4.0 – 7.0 mln",
        seniorIncomeMln: "14.0 – 32.0 mln",
        workloadNote: "Tibbiyotga tayyorlanuvchi abituriyentlar ko'pligi sabab repetitorlik bozori juda kuchli",
      },
      {
        title: "Shifokor / Klinik mutaxassis",
        sector: "Muhandislik va Tibbiyot",
        degreePath: "Tibbiyot instituti (6 yil + ordinatura)",
        entryIncomeMln: "4.5 – 7.5 mln",
        seniorIncomeMln: "15.0 – 45.0+ mln",
        workloadNote: "Xususiy klinikalarda tajribali shifokorlar daromadi juda yuqori",
      },
      {
        title: "Farmatsevtika va Sifat nazorati kimyogari",
        sector: "Muhandislik va Tibbiyot",
        degreePath: "Farmatsevtika / Kimyo-texnologiya",
        entryIncomeMln: "5.0 – 8.5 mln",
        seniorIncomeMln: "13.0 – 25.0 mln",
        workloadNote: "Dori ishlab chiqarish zavodlari va laboratoriyalar",
      },
    ],
    incomeStages: [
      { stage: "Laborant / Stajyor", label: "Talabalik", minMln: 2.0, maxMln: 4.5, note: "Klinika hamshirasi yoki laboratoriya yordamchisi" },
      { stage: "Bakalavr bitiruvchi", label: "1–2 yil", minMln: 4.2, maxMln: 8.0, note: "Maktab ustozi yoki kichik kimyogar" },
      { stage: "1-toifa / Ordinatura bitiruvchi", label: "3–5 yil", minMln: 8.5, maxMln: 18.0, note: "Milliy sertifikat + xususiy klinika/markaz" },
      { stage: "Oliy toifa / Tor mutaxassis shifokor", label: "6+ yil", minMln: 16.0, maxMln: 42.0, note: "Xususiy klinika yoki kuchli DTM maktabi" },
    ],
  },
  {
    id: "tarix-huquq",
    name: "Tarix va Huquq",
    tagline: "Davlat boshqaruvi, yuristprudensiya, advokatura va huquqshunoslik",
    interestHook: "Har bir yirik biznes, IT kompaniya va xalqaro shartnoma kuchli yurist himoyasiga muhtoj; tarix esa barcha OTMlar uchun majburiy fan.",
    realWorldFacts: [
      "IT-huquq, intellektual mulk va xalqaro savdo advokatlari soatiga $50–$150 gacha konsalting xizmati ko'rsatadi.",
      "O'zbekiston tarixi barcha abituriyentlar uchun majburiy blokda bo'lgani uchun Tarix ustozlariga talab doimiy yuqori.",
      "TDYU va JIDU bitiruvchilari ham davlat organlarida, ham xususiy korporatsiyalarda nufuzli lavozimlarda ishlaydi.",
    ],
    keyUniversities: ["TDYU (Yuridik)", "JIDU (Diplomatiya)", "O'zMU", "BuxDU", "TDPU"],
    dtmBlock: "1-fan: Tarix (3.1 ball) · 2-fan: Huquqshunoslik / Ingliz tili (2.1 ball) · Majburiy fanlar",
    avgGrantScore: "160 – 186 ball",
    instituteOptions: "Pedagogika institutlari (Tarix va huquq o'qituvchisi)",
    universityOptions: "TDYU (Yuridik universitet), JIDU, O'zMU — advokat, korporativ yurist, diplomat, tarixchi",
    bachelorOutcome: "Korxonalarda yurist yordamchisi, davlat organlarida mutaxassis yoki maktabda Tarix/Huquq o'qituvchisi.",
    masterOutcome: "Advokatlik litsenziyasi, sudya/prokuratura tizimi, xalqaro huquq va arbitraj.",
    roles: [
      {
        title: "Korporativ yurist / Advokat",
        sector: "Moliya va Biznes",
        degreePath: "TDYU / Yuridik fakultet",
        entryIncomeMln: "5.5 – 9.5 mln",
        seniorIncomeMln: "18.0 – 45.0 mln",
        workloadNote: "Xususiy biznes va xorijiy investitsiya loyihalarida yuristlarga talab yuqori",
      },
      {
        title: "Tarix va Huquq o'qituvchisi",
        sector: "Ta'lim va Pedagogika",
        degreePath: "Pedagogika instituti / O'zMU",
        entryIncomeMln: "3.8 – 6.0 mln",
        seniorIncomeMln: "11.0 – 22.0 mln",
        workloadNote: "Tarix milliy sertifikati va Oliy toifa orqali maosh sezilarli oshadi",
      },
    ],
    incomeStages: [
      { stage: "Yurist yordamchisi", label: "3–4-kurs", minMln: 2.5, maxMln: 5.0, note: "Advokatlik firmalarida stajirovka" },
      { stage: "Bakalavr yurist / ustoz", label: "1–2 yil", minMln: 4.5, maxMln: 9.0, note: "Kompaniya yuristi yoki maktab darslari" },
      { stage: "Mustaqil yurist / 1-toifa", label: "3–5 yil", minMln: 10.0, maxMln: 20.0, note: "Shartnomalar va huquqiy himoya" },
      { stage: "Bosh yurist / Advokat", label: "5+ yil", minMln: 18.0, maxMln: 42.0, note: "Xususiy amaliyot va konsalting" },
    ],
  },
  {
    id: "iqtisodiyot",
    name: "Iqtisodiyot va Moliya",
    tagline: "Bank, audit, buxgalteriya, biznes tahlil va tadbirkorlik asoslari",
    interestHook: "Pul oqimlarini boshqarish, investitsiya kiritish va xalqaro audit (ACCA/CFA) — biznes olamining yuragi.",
    realWorldFacts: [
      "Xalqaro ACCA sertifikatining yarmini olgan yosh mutaxassislarga Big-4 kompaniyalari 15–25 mln so'm boshlang'ich maosh taklif qiladi.",
      "Buxgalteriya autsorsingi orqali bitta mutaxassis bir vaqtning o'zida 4–5 ta firmaga masofadan xizmat ko'rsata oladi.",
      "Bank va fintex ilovalari (Payme, Uzum, Click) moliyaviy tahlilchilarga katta talab yaratmoqda.",
    ],
    keyUniversities: ["TDIU", "Toshkent Moliya instituti", "Vestminster (WIUT)", "MDIST", "O'zMU"],
    dtmBlock: "1-fan: Matematika (3.1 ball) · 2-fan: Ingliz tili / Geografiya (2.1 ball) · Majburiy fanlar",
    avgGrantScore: "155 – 180 ball",
    instituteOptions: "Moliya va Iqtisodiyot institutlari — buxgalteriya, soliq, bank ishi",
    universityOptions: "TDIU, Vestminster, Singapur menejment (MDIST) — xalqaro moliya, ACCA, audit, marketing",
    bachelorOutcome: "Bank operatsionisti, kichik buxgalter, moliyaviy nazoratchi, biznes tahlilchi.",
    masterOutcome: "Moliya direktori (CFO), Big-4 audit kompaniyalari menejeri, investitsiya tahlilchisi.",
    roles: [
      {
        title: "Moliyaviy tahlilchi / Auditor (ACCA bilan)",
        sector: "Moliya va Biznes",
        degreePath: "TDIU / Xalqaro universitet",
        entryIncomeMln: "6.0 – 10.0 mln",
        seniorIncomeMln: "20.0 – 45.0 mln",
        workloadNote: "Xalqaro ACCA/CFA sertifikatlari oylikni 2–3 baravar oshiradi",
      },
      {
        title: "Bosh buxgalter / Soliq maslahatchisi",
        sector: "Moliya va Biznes",
        degreePath: "Moliya / Iqtisodiyot",
        entryIncomeMln: "5.0 – 8.0 mln",
        seniorIncomeMln: "15.0 – 30.0 mln",
        workloadNote: "Bir nechta kompaniyani masofaviy yuritish (autsorsing) imkoniyati bor",
      },
    ],
    incomeStages: [
      { stage: "Amaliyotchi", label: "3–4-kurs", minMln: 2.5, maxMln: 5.5, note: "Bank yoki buxgalteriya firmasida yordamchi" },
      { stage: "Kichik mutaxassis", label: "Bakalavr", minMln: 5.5, maxMln: 9.5, note: "Bank mutaxassisi yoki kichik auditor" },
      { stage: "Tajribali moliyachi", label: "2–4 yil", minMln: 11.0, maxMln: 22.0, note: "ACCA qismlari bilan yuqori lavozim" },
      { stage: "Moliya rahbari (CFO)", label: "5+ yil", minMln: 22.0, maxMln: 45.0, note: "Yirik korxona va xoldinglar" },
    ],
  },
  {
    id: "ona-tili",
    name: "Ona tili va Adabiyot",
    tagline: "Majburiy fan bo'lgani uchun eng barqaror repetitorlik va jurnalistika sohasi",
    interestHook: "O'zbekistondagi barcha 1 millionga yaqin abituriyent Ona tilidan imtihon topshiradi — bu sizning kasbingizga cheksiz bozor demakdir.",
    realWorldFacts: [
      "Ona tili va adabiyot milliy sertifikati bilan OTM imtihonida ham asosiy, ham majburiy blokdan tayyor ball olish mumkin.",
      "Zamonaviy PR menejerlar, kopirayterlar va media-prodyuserlar aynan kuchli filologik savodxonlikka tayanadi.",
      "Oliy toifali Ona tili ustozi maktab + DTM tayyorlov guruhlari bilan barqaror 15–25 mln so'm daromad topadi.",
    ],
    keyUniversities: ["Alisher Navoiy nomidagi O'zDTU", "O'zJOKU", "O'zMU", "TDPU", "SamDU"],
    dtmBlock: "1-fan: Ona tili va adabiyot (3.1 ball) · 2-fan: Tarix / Ingliz tili (2.1 ball) · Majburiy fanlar",
    avgGrantScore: "145 – 172 ball",
    instituteOptions: "Pedagogika institutlari — maktab va akademik litsey o'qituvchisi",
    universityOptions: "Alisher Navoiy nomidagi O'zDTU, O'zJOKU, O'zMU — filologiya, muharrirlik, PR, kopirayting",
    bachelorOutcome: "Maktabda dars berish (1–1.5 stavka), nashriyotda muharrir, PR/SMM kontent menejer.",
    masterOutcome: "OTM o'qituvchisi, ilmiy tadqiqotchi, bosh muharrir va media loyiha rahbari.",
    roles: [
      {
        title: "Ona tili va adabiyot ustozi",
        sector: "Ta'lim va Pedagogika",
        degreePath: "O'zDTU / Pedagogika instituti",
        entryIncomeMln: "3.8 – 6.2 mln",
        seniorIncomeMln: "12.0 – 25.0 mln",
        workloadNote: "Majburiy fan sifatida barcha abituriyentlarga kerakligi uchun repetitorlik talabi juda yuqori",
      },
      {
        title: "PR menejer / Muharrir / Kontent strateg",
        sector: "Moliya va Biznes",
        degreePath: "O'zJOKU / Filologiya",
        entryIncomeMln: "4.5 – 7.5 mln",
        seniorIncomeMln: "12.0 – 24.0 mln",
        workloadNote: "IT kompaniyalar, media va bank marketing jamoalarida ish",
      },
    ],
    incomeStages: [
      { stage: "Talaba muharrir", label: "3–4-kurs", minMln: 2.0, maxMln: 4.5, note: "Kontent yozish va dars yordamchisi" },
      { stage: "Bakalavr ustoz", label: "1–2 yil", minMln: 4.0, maxMln: 7.5, note: "Maktabda 20–30 soat + milliy sertifikat" },
      { stage: "1-toifa / Kontent lead", label: "3–5 yil", minMln: 8.5, maxMln: 16.0, note: "Toifa + DTM tayyorlov guruhlari" },
      { stage: "Oliy toifa / O'quv markaz", label: "5+ yil", minMln: 14.0, maxMln: 28.0, note: "Katta guruhlar va mualliflik kurslari" },
    ],
  },
];

export interface ComparisonRow {
  criterion: string;
  institute: string;
  university: string;
}

export interface FieldScenario {
  id: string;
  label: string;
  instituteResult: string;
  universityResult: string;
  salaryDifferenceNote: string;
}

export const INSTITUTION_COMPARISON: ComparisonRow[] = [
  {
    criterion: "Asosiy maqsad va yo'nalish",
    institute: "Aniq bir amaliy kasbga (masalan, maktab o'qituvchisi, muhandis-texnolog, shifokor) tayyorlaydi.",
    university: "Fundamental fan, ilmiy tadqiqot va keng tarmoqli tahliliy mutaxassislik beradi.",
  },
  {
    criterion: "O'qitish uslubi va amaliyot",
    institute: "Kasbiy metodika va amaliy mashg'ulotlar ulushi ko'proq (maktab/zavod/klinika amaliyoti).",
    university: "Nazariy chuqurlik, tadqiqot, laboratoriyalar va fanlararo modullar ustunlik qiladi.",
  },
  {
    criterion: "Bitirgandan keyin kim bo'lasiz?",
    institute: "Bevosita soha mutaxassisi: fan o'qituvchisi, energetik, quruvchi, shifokor.",
    university: "Tahlilchi, dasturchi, iqtisodchi, ilmiy xodim, shuningdek pedagogik yo'nalishda o'qituvchi.",
  },
  {
    criterion: "Maktabda dars berish huquqi",
    institute: "Pedagogika instituti diplomi to'g'ridan-to'g'ri maktabda dars berish huquqini beradi.",
    university: "Pedagogika yo'nalishi bo'lsa to'g'ridan-to'g'ri; nopedagogik yo'nalishda esa qayta tayyorlov kursi orqali.",
  },
  {
    criterion: "Magistratura va ilmiy martaba",
    institute: "Amaliy magistraturaga o'tish va sohada rahbar bo'lish mumkin.",
    university: "Ilmiy tadqiqot, PhD, OTM o'qituvchisi va xalqaro grantlar uchun eng qulay baza.",
  },
  {
    criterion: "Diplom kuchi va oylik",
    institute: "Maktab va davlat tashkilotlarida Universitet diplomi bilan teng huquqli; toifa olishda bir xil.",
    university: "Xususiy korporatsiya, IT va xalqaro kompaniyalarda keng profili sabab ko'proq tanlov beradi.",
  },
];

export const FIELD_SCENARIOS: FieldScenario[] = [
  {
    id: "matematika",
    label: "Matematika yo'nalishida",
    instituteResult: "Pedagogika institutida o'qisangiz — tayyor Matematika fani o'qituvchisi bo'lasiz. Maktab dars berish metodikasini chuqur o'rganasiz va 4-kursdayoq maktabga kirib ketishingiz oson.",
    universityResult: "Universitetda (masalan O'zMU) 'Amaliy matematika' o'qisangiz — Data Analyst, Dasturchi, Bank tahlilchisi yoki ilmiy xodim bo'lasiz. Maktabda dars bermoqchi bo'lsangiz ham 'Matematika o'qitish' yoki qo'shimcha pedagogik modul bilan bemalol o'qituvchi bo'la olasiz.",
    salaryDifferenceNote: "Davlat maktabida Institut va Universitet bitiruvchisi bir xil stavka va toifa asosida oylik oladi. Farq xususiy sektor (IT/Bank) ga kirishda seziladi.",
  },
  {
    id: "it",
    label: "IT va Dasturlashda",
    instituteResult: "Texnika institutida o'qisangiz — amaliy tizim administratori, ishlab chiqarish avtomatlashtirish muhandisi yoki axborot texnologiyalari o'qituvchisi bo'lasiz.",
    universityResult: "IT Universitetida (TATU, INHA, New Uzbekistan Univ) o'qisangiz — Software Engineer, AI/ML mutaxassisi, Kiberxavfsizlik arxitektori sifatida xalqaro bozorga chiqishingiz osonlashadi.",
    salaryDifferenceNote: "IT sohasida diplom turidan ko'ra amaliy kod yozish ko'nikmasi, ingliz tili va real loyihalar (portfolio) oylikni belgilaydi.",
  },
  {
    id: "iqtisodiyot",
    label: "Iqtisodiyot va Biznesda",
    instituteResult: "Moliya/Soliq institutida o'qisangiz — aniq yo'nalishli buxgalter, soliq inspektori yoki bank operatsion mutaxassisi bo'lib chiqasiz.",
    universityResult: "Iqtisodiyot universitetida o'qisangiz — makroiqtisodiy tahlilchi, xalqaro moliya menejeri, biznes strateg yoki auditorlik kompaniyasi xodimi bo'lasiz.",
    salaryDifferenceNote: "Xalqaro sertifikat (ACCA, CFA) va ingliz tili bilan har ikki bitiruvchi ham 15–35 mln so'mgacha chiqishi mumkin.",
  },
  {
    id: "tibbiyot",
    label: "Tibbiyot va Farmatsevtikada",
    instituteResult: "O'zbekistonda tibbiyot bo'yicha asosiy oliygohlar Institut/Akademiya shaklida (ToshPTI, SamDTI, AndDTI) — bevosita amaliyotchi shifokor, pediatr, jarroh tayyorlaydi.",
    universityResult: "Universitetda Biologiya/Biotexnologiya o'qisangiz — shifokor emas, balki genetik-laborant, farmatsevtika tadqiqotchisi yoki Biologiya o'qituvchisi bo'lasiz.",
    salaryDifferenceNote: "Agar maqsad bemor davolash (shifokorlik) bo'lsa — albatta Tibbiyot instituti/akademiyasini tanlash shart!",
  },
];

export interface ToifaTier {
  id: string;
  name: string;
  shortDesc: string;
  baseRate1StavkaMln: number;
  yearsRequired: string;
}

export const TOIFA_TIERS: ToifaTier[] = [
  {
    id: "mutaxassis",
    name: "Oliy ma'lumotli mutaxassis (Bakalavr)",
    shortDesc: "OTMni endi bitirgan yosh kadr",
    baseRate1StavkaMln: 3.85,
    yearsRequired: "0 yil (Bitiruvchi)",
  },
  {
    id: "ikkinchi",
    name: "2-malaka toifasi",
    shortDesc: "Attestatsiyadan muvaffaqiyatli o'tgan o'qituvchi",
    baseRate1StavkaMln: 4.5,
    yearsRequired: "1–3 yil",
  },
  {
    id: "birinchi",
    name: "1-malaka toifasi",
    shortDesc: "Yuqori metodik va fan ko'rsatkichiga ega ustoz",
    baseRate1StavkaMln: 5.25,
    yearsRequired: "3–5 yil",
  },
  {
    id: "oliy",
    name: "Oliy malaka toifasi",
    shortDesc: "Maktabdagi eng yuqori pedagogik daraja",
    baseRate1StavkaMln: 6.15,
    yearsRequired: "5+ yil (yoki yuqori ball bilan muddatidan oldin)",
  },
];

export interface VacancyItem {
  id: string;
  title: string;
  employer: string;
  city: string;
  format: "Maktab / Ta'lim" | "Ofis" | "Gibrid" | "Masofaviy";
  subjectTag: string;
  minEducation: "10–11-sinf / Stajyor" | "Bakalavr" | "Toifali pedagog" | "Magistr / Tajribali";
  institutionFit: string;
  workload: string;
  salaryMin: number;
  salaryMax: number;
  skills: string[];
  growthPath: string;
  description: string;
}

export const VACANCIES: VacancyItem[] = [
  {
    id: "v1",
    title: "Matematika fani o'qituvchisi (1.5 stavka)",
    employer: "Ixtisoslashtirilgan ta'lim muassasalari agentligi maktabi",
    city: "Toshkent",
    format: "Maktab / Ta'lim",
    subjectTag: "Matematika",
    minEducation: "Toifali pedagog",
    institutionFit: "Pedagogika instituti yoki O'zMU (Matematika)",
    workload: "Haftasiga 24–30 soat (1.2–1.5 stavka)",
    salaryMin: 9.5,
    salaryMax: 18.0,
    skills: ["Oliy yoki 1-toifa", "Milliy sertifikat (B+/A)", "Olimpiada masalalari"],
    growthPath: "Oliy toifa + Prezident maktablari tizimi + Vazir jamg'armasi (+5.5 mln)",
    description: "Ixtisoslashtirilgan sinflarda chuqurlashtirilgan algebra va geometriya darslarini o'tish. Milliy sertifikat va toifa uchun to'liq ustamalar to'lanadi.",
  },
  {
    id: "v2",
    title: "Junior Data Analyst (Stajyor / Bakalavr)",
    employer: "Payme / FinTech hamkor jamoasi",
    city: "Toshkent",
    format: "Gibrid",
    subjectTag: "Matematika",
    minEducation: "Bakalavr",
    institutionFit: "Universitet (Amaliy matematika, Iqtisodiyot, TATU)",
    workload: "To'liq stavka (haftasiga 40 soat)",
    salaryMin: 7.5,
    salaryMax: 13.0,
    skills: ["SQL asoslari", "Python (Pandas)", "Excel / Power BI", "Ehtimollar nazariyasi"],
    growthPath: "6 oyda Middle Analyst (16–22 mln), 2 yilda Senior / Product Analyst (30+ mln)",
    description: "Tranzaksiya ma'lumotlarini tahlil qilish, hisobotlar va dashboardlar tuzish. Matematika va statistika bazasi kuchli 4-kurs talabalari ham ko'rib chiqiladi.",
  },
  {
    id: "v3",
    title: "Matematika o'qituvchisi (Yosh mutaxassis)",
    employer: "Davlat umumta'lim maktabi №42",
    city: "Samarqand",
    format: "Maktab / Ta'lim",
    subjectTag: "Matematika",
    minEducation: "Bakalavr",
    institutionFit: "Pedagogika instituti yoki Universitet",
    workload: "Haftasiga 20–26 soat (1.0–1.3 stavka)",
    salaryMin: 4.0,
    salaryMax: 7.2,
    skills: ["Bakalavr diplomi", "5–11-sinf dasturi", "Sinf rahbarligi tayyorligi"],
    growthPath: "1-yilda Milliy sertifikat (+20–50%), 2-toifa, keyin 1-toifa va Oliy toifa",
    description: "Bakalavrni yangi bitirgan yosh mutaxassislar uchun barqaror ish o'rni. Barcha rasmiy ustamalar va mehnat ta'tili kafolatlanadi.",
  },
  {
    id: "v4",
    title: "DTM Matematika va Mantiq Repetitori",
    employer: "Registon Ta'lim Markazi",
    city: "Toshkent",
    format: "Maktab / Ta'lim",
    subjectTag: "Matematika",
    minEducation: "10–11-sinf / Stajyor",
    institutionFit: "OTM talabasi (2–4-kurs) yoki Bitiruvchi",
    workload: "Kunning 2-yarmi, 4–6 guruh",
    salaryMin: 8.0,
    salaryMax: 24.0,
    skills: ["189 ballik DTM test tizimi", "Tezkor yechim usullari", "Notiqlik"],
    growthPath: "Guruhlar soni oshishi bilan 25–40 mln so'mgacha foizli daromad",
    description: "Abituriyentlarni oliygohga tayyorlash. Dars soatlari o'quvchi natijasiga qarab moslashuvchan belgilanadi.",
  },
  {
    id: "v5",
    title: "Ingliz tili ustozi (C1 / IELTS 7.0+ ustamasi bilan)",
    employer: "Davlat va Xususiy hamkor maktab",
    city: "Farg'ona",
    format: "Maktab / Ta'lim",
    subjectTag: "Ingliz tili",
    minEducation: "Bakalavr",
    institutionFit: "O'zDJTU, Pedagogika instituti, Filologiya",
    workload: "Haftasiga 22–28 soat",
    salaryMin: 6.2,
    salaryMax: 12.5,
    skills: ["IELTS 7.0+ / CEFR C1", "Kommunikativ metodika", "Milliy darsliklar"],
    growthPath: "C1 +50% ustama darhol ishga tushadi; Oliy toifada 14+ mln",
    description: "C1 sertifikatiga ega bakalavr bitiruvchilariga birinchi oydanoq 50 foiz qo'shimcha ustama bilan maosh hisoblanadi.",
  },
  {
    id: "v6",
    title: "Junior Backend Dasturchi (Python / Node.js)",
    employer: "IT Park Rezident Kompaniyasi",
    city: "Masofaviy",
    format: "Masofaviy",
    subjectTag: "Informatika",
    minEducation: "10–11-sinf / Stajyor",
    institutionFit: "TATU, INHA, Amity yoki mustaqil kuchli portfolio",
    workload: "To'liq yoki moslashuvchan 35–40 soat",
    salaryMin: 6.5,
    salaryMax: 12.0,
    skills: ["Python/FastAPI yoki Node.js", "PostgreSQL", "Git", "REST API"],
    growthPath: "1–1.5 yilda Middle (14–22 mln), ingliz tili bilan xalqaro remote ($2,000+)",
    description: "Yirik e-tijorat va ta'lim platformalari backend qismini ishlab chiqish. Yosh va salohiyatli dasturchilar uchun mentorlik mavjud.",
  },
  {
    id: "v7",
    title: "Informatika fani o'qituvchisi va Robototexnika murabbiyi",
    employer: "Zamonaviy Xususiy Maktab",
    city: "Andijon",
    format: "Maktab / Ta'lim",
    subjectTag: "Informatika",
    minEducation: "Bakalavr",
    institutionFit: "Pedagogika instituti yoki TATU",
    workload: "Haftasiga 24 soat dars + to'garak",
    salaryMin: 6.5,
    salaryMax: 11.5,
    skills: ["Python asoslari", "Scratch / Arduino", "IT sertifikat"],
    growthPath: "IT akademiya bo'limi rahbari (15+ mln)",
    description: "O'quvchilarga zamonaviy dasturlash, algoritmik fikrlash va robototexnika asoslarini o'rgatish.",
  },
  {
    id: "v8",
    title: "Quyosh elektr stansiyasi muhandis-energetigi",
    employer: "Yashil Energiya Loyihalari MChJ",
    city: "Buxoro",
    format: "Ofis",
    subjectTag: "Fizika",
    minEducation: "Bakalavr",
    institutionFit: "Texnika universiteti yoki Politexnika instituti",
    workload: "To'liq stavka (5/2)",
    salaryMin: 7.0,
    salaryMax: 14.5,
    skills: ["Elektrotexnika", "AutoCAD", "Fizika va energetika qonunlari"],
    growthPath: "Loyiha bosh muhandisi (20–30 mln)",
    description: "Sanoat va quyosh panellari tizimlarini loyihalash, texnik nazorat va energiya samaradorligini hisoblash.",
  },
  {
    id: "v9",
    title: "Bank Kredit va Risk tahlilchisi",
    employer: "Respublika Tijorat Banki",
    city: "Toshkent",
    format: "Ofis",
    subjectTag: "Iqtisodiyot",
    minEducation: "Bakalavr",
    institutionFit: "TDIU, Moliya instituti, Vestminster",
    workload: "To'liq stavka (09:00–18:00)",
    salaryMin: 7.0,
    salaryMax: 13.5,
    skills: ["Moliyaviy hisobot tahlili", "Excel (murakkab formulalar)", "Mantiqiy matematika"],
    growthPath: "Bo'lim boshlig'i / Risk menejer (20–32 mln)",
    description: "Korporativ mijozlarning kredit layoqatini baholash va moliyaviy modellar tuzish.",
  },
  {
    id: "v10",
    title: "Biokimyo va Klinik Laboratoriya mutaxassisi",
    employer: "Zamonaviy Diagnostika Markazi",
    city: "Namangan",
    format: "Ofis",
    subjectTag: "Kimyo va Biologiya",
    minEducation: "Bakalavr",
    institutionFit: "O'zMU (Biotexnologiya), Tibbiyot yoki Farmatsevtika instituti",
    workload: "Smenali grafik (36 soat)",
    salaryMin: 5.5,
    salaryMax: 10.5,
    skills: ["PZR va biokimyoviy tahlil", "Kimyoviy reaktivlar xavfsizligi"],
    growthPath: "Laboratoriya mudiri (14–22 mln)",
    description: "Avtomatlashgan diagnostika uskunalarida tibbiy-biologik tahlillarni bajarish va sifat nazorati.",
  },
  {
    id: "v11",
    title: "Korporativ Yurist yordamchisi",
    employer: "Xalqaro Savdo va Logistika Kompaniyasi",
    city: "Toshkent",
    format: "Gibrid",
    subjectTag: "Tarix va Huquq",
    minEducation: "Bakalavr",
    institutionFit: "TDYU, JIDU, Yuridik fakultet",
    workload: "To'liq stavka",
    salaryMin: 6.0,
    salaryMax: 11.0,
    skills: ["Fuqarolik va mehnat kodeksi", "Shartnomalar tuzish", "Ingliz/Rus tili"],
    growthPath: "Bosh yurist / Advokat (18–35 mln)",
    description: "Tashqi savdo shartnomalarini huquqiy ekspertizadan o'tkazish va litsenziya hujjatlarini yuritish.",
  },
  {
    id: "v12",
    title: "Ona tili va Adabiyot (Majburiy fan) instruktori",
    employer: "Yuksalish Abituriyentlar Maktabi",
    city: "Samarqand",
    format: "Maktab / Ta'lim",
    subjectTag: "Ona tili",
    minEducation: "Toifali pedagog",
    institutionFit: "O'zDTU, Pedagogika instituti",
    workload: "Haftasiga 20–24 soat",
    salaryMin: 7.5,
    salaryMax: 16.0,
    skills: ["Milliy sertifikat", "Esse va grammatika metodikasi"],
    growthPath: "Oliy toifa + Mualliflik kursi (20+ mln)",
    description: "10–11-sinf o'quvchilarini majburiy ona tili va milliy sertifikat imtihonlariga yuqori natija bilan tayyorlash.",
  },
];
