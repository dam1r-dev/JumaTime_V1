import "dotenv/config";
import bcrypt from "bcryptjs";
import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaLibSql } from "@prisma/adapter-libsql";
import alKahfAyahs from "./data/al-kahf.json";

const adapter = new PrismaLibSql({ url: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

async function main() {
  await prisma.khutbahTranslation.deleteMany();
  await prisma.khutbah.deleteMany();
  await prisma.contentTranslation.deleteMany();
  await prisma.contentBlock.deleteMany();
  await prisma.quranAyahTranslation.deleteMany();
  await prisma.quranAyah.deleteMany();
  await prisma.adminUser.deleteMany();
  await prisma.mosque.deleteMany();

  const mosques = [
    { slug: "baiken", name: "Мечеть Байкен", order: 1 },
    { slug: "abu-bakr", name: "Мечеть Абу-Бакр", order: 2 },
  ];
  for (const m of mosques) {
    await prisma.mosque.create({ data: m });
  }
  console.log(`Seeded ${mosques.length} mosques`);

  const baiken = await prisma.mosque.findUniqueOrThrow({ where: { slug: "baiken" } });
  const abuBakr = await prisma.mosque.findUniqueOrThrow({ where: { slug: "abu-bakr" } });

  // Один админ-аккаунт = одна мечеть. Второй — демо-аккаунт для показа мультимечетности,
  // перед боевым использованием стоит сменить пароли обоих (или удалить второй).
  const admins = [
    {
      mosqueId: baiken.id,
      email: process.env.SEED_ADMIN_EMAIL ?? "imam@jummatime.kz",
      password: process.env.SEED_ADMIN_PASSWORD ?? "ChangeMe123!",
      name: process.env.SEED_ADMIN_NAME ?? "Имам",
    },
    {
      mosqueId: abuBakr.id,
      email: process.env.SEED_ADMIN2_EMAIL ?? "imam2@jummatime.kz",
      password: process.env.SEED_ADMIN2_PASSWORD ?? "ChangeMe123!",
      name: process.env.SEED_ADMIN2_NAME ?? "Имам 2",
    },
  ];
  for (const a of admins) {
    const passwordHash = await bcrypt.hash(a.password, 10);
    await prisma.adminUser.upsert({
      where: { email: a.email },
      update: { mosqueId: a.mosqueId, name: a.name, passwordHash },
      create: { mosqueId: a.mosqueId, email: a.email, name: a.name, passwordHash },
    });
    console.log(`Admin user ready: ${a.email}`);
  }

  const khutbahs = [
    {
      mosqueSlug: "baiken",
      slug: "shukr-2026-07-03",
      date: new Date("2026-07-03"),
      originalLocale: "kk",
      translations: [
        {
          locale: "kk",
          title: "Шүкіршілік — сенімнің жартысы",
          summary:
            "Аллаһтың берген игіліктеріне шүкір ету жүрекке тыныштық пен береке әкелетіні жайлы хұтба.",
          body: "Бисмиллаһир-Рахманир-Рахим.\n\nҚадірлі мұсылман бауырлар! Аллаһ Тағала бізге санаусыз игіліктер берген: денсаулық, отбасы, күнделікті нан, тыныс алар ауа. Осы игіліктерге шүкір ету — иманның маңызды бөлігі.\n\nПайғамбарымыз ﷺ: «Аз нәрсеге шүкір етпеген адам көп нәрсеге де шүкір етпейді» деген. Шүкіршілік — тек тілмен айту емес, жүрекпен сезініп, дене мүшелерімізбен әрекет ету.\n\nҚалай шүкір етеміз? Бірінші — берілген игілікті мойындау. Екінші — Аллаһқа алғыс айту. Үшінші — сол игілікті Аллаһ разы болатын жолда пайдалану.\n\nҚиыншылық кезінде де сабыр етіп, жақсылық кезінде шүкір ететін мұсылман — екі жағдайда да жеңіске жетеді, өйткені Пайғамбарымыз ﷺ айтқандай, мұның бәрі мұсылман үшін қайырлы.\n\nАллаһ Тағала бізді шүкір етушілерден етсін.",
        },
        {
          locale: "ru",
          title: "Благодарность — половина веры",
          summary:
            "Хутба о том, как благодарность Аллаху за дарованные блага приносит покой сердцу и баракят в жизнь.",
          body: "Бисмилляхи-р-Рахмани-р-Рахим.\n\nДорогие братья и сестры! Аллах Всевышний даровал нам бесчисленные блага: здоровье, семью, хлеб насущный, воздух, которым мы дышим. Благодарность за эти блага — важная часть веры.\n\nПророк ﷺ сказал: «Тот, кто не благодарит за малое, не будет благодарить и за многое». Благодарность — это не только слова, но и чувство в сердце, и действия наших органов.\n\nКак мы благодарим? Во-первых — признаём, что благо даровано нам. Во-вторых — произносим слова благодарности Аллаху. В-третьих — используем это благо на пути, которым доволен Аллах.\n\nВерующий, который проявляет терпение в трудностях и благодарность в благополучии, побеждает в обоих случаях — ведь, как сказал Пророк ﷺ, всё это благо для верующего.\n\nПусть Аллах сделает нас из числа благодарных.",
        },
        {
          locale: "en",
          title: "Gratitude — Half of Faith",
          summary:
            "A khutbah on how gratitude to Allah for His blessings brings peace to the heart and barakah into our lives.",
          body: "Bismillahir-Rahmanir-Rahim.\n\nDear brothers and sisters! Allah the Almighty has given us countless blessings: health, family, our daily bread, the very air we breathe. Being grateful for these blessings is an essential part of faith.\n\nThe Prophet ﷺ said: \"He who does not thank people has not thanked Allah.\" Gratitude is not only words — it is a feeling in the heart and action of our limbs.\n\nHow do we give thanks? First, by acknowledging the blessing. Second, by verbally thanking Allah. Third, by using that blessing in a way that pleases Allah.\n\nA believer who is patient in hardship and grateful in ease succeeds in both states — for, as the Prophet ﷺ said, all of it is good for the believer.\n\nMay Allah make us among the grateful.",
        },
      ],
    },
    {
      mosqueSlug: "baiken",
      slug: "birlik-2026-07-10",
      date: new Date("2026-07-10"),
      originalLocale: "kk",
      translations: [
        {
          locale: "kk",
          title: "Мұсылман бауырластығы мен бірлік",
          summary:
            "Умма арасындағы бірлік пен мұсылман бауырластығының маңызы жайлы уағыз.",
          body: "Бисмиллаһир-Рахманир-Рахим.\n\nАллаһ Тағала мұсылмандарды бір-біріне бауыр етіп жаратты. «Мұсылмандар — бір-біріне бауыр» дейді Құран Кәрім. Бұл бауырластық тек сөзде емес, іс жүзінде көрінуі керек.\n\nБір-бірімізге қамқорлық жасау, көмек беру, жақсылыққа шақырып, жамандықтан тыю — осының барлығы мұсылман бауырластығының белгісі.\n\nПайғамбарымыз ﷺ: «мұсылмандар бір денедей, бір мүшесі ауырса, бүкіл дене сол ауруды сезінеді» деген. Осындай бірлікте болу — қоғамымызды нығайтады, ынтымағымызды арттырады.\n\nҚордаланған келіспеушіліктерді, өсек-аяңды, бір-бірімізден бас тартуды доғарайық. Мешітке жиналған сайын осы бірлікті еске түсірейік.\n\nАллаһ бізді бір-бірімізге мейірімді мұсылмандардан етсін.",
        },
        {
          locale: "ru",
          title: "Братство верующих и единство",
          summary:
            "Проповедь о важности единства и братства между верующими в мусульманской общине.",
          body: "Бисмилляхи-р-Рахмани-р-Рахим.\n\nАллах Всевышний создал верующих братьями друг другу. «Верующие — братья», — говорит Священный Коран. Это братство должно проявляться не только на словах, но и на деле.\n\nЗабота друг о друге, взаимопомощь, побуждение к добру и удержание от зла — всё это признаки братства верующих.\n\nПророк ﷺ сказал: «Верующие подобны одному телу: если заболевает один орган, всё тело чувствует эту боль». Такое единство укрепляет наше общество и увеличивает взаимную поддержку.\n\nОставим накопленные разногласия, сплетни и отчуждение друг от друга. Пусть каждый раз, собираясь в мечети, мы вспоминаем об этом единстве.\n\nПусть Аллах сделает нас милосердными друг к другу верующими.",
        },
        {
          locale: "en",
          title: "Brotherhood and Unity Among Believers",
          summary:
            "A sermon on the importance of unity and brotherhood within the Muslim community.",
          body: "Bismillahir-Rahmanir-Rahim.\n\nAllah the Almighty made the believers brothers to one another. \"The believers are but brothers,\" says the Noble Qur'an. This brotherhood must show not only in words but in action.\n\nCaring for one another, helping each other, calling to good and forbidding evil — these are all signs of the brotherhood of believers.\n\nThe Prophet ﷺ said: \"The believers, in their mutual love, mercy and compassion, are like one body — when one part of it complains, the whole body responds with sleeplessness and fever.\" Such unity strengthens our community and increases mutual support.\n\nLet us set aside accumulated disagreements, gossip, and estrangement from one another. Every time we gather at the mosque, let us remember this unity.\n\nMay Allah make us merciful believers toward one another.",
        },
      ],
    },
    {
      mosqueSlug: "baiken",
      slug: "sabyr-2026-07-17",
      date: new Date("2026-07-17"),
      originalLocale: "kk",
      translations: [
        {
          locale: "kk",
          title: "Сабыр — жеңіске апарар жол",
          summary: "Өмірдегі қиыншылықтарға сабыр етудің сауабы мен мәні туралы хұтба.",
          body: "Бисмиллаһир-Рахманир-Рахим.\n\nӨмір сынақтарға толы. Аллаһ Тағала бізді әр түрлі жағдайлармен сынайды: денсаулық, мал-мүлік, жақындарымыздан айырылу.\n\nҚұран Кәрімде: «Сабыр етушілерге сауапты есепсіз береміз» делінген. Сабыр — қиыншылық алдында дауыс көтермей, күпірлікке бармай, Аллаһтың қазасына разы болу.\n\nСабырдың үш түрі бар: құлшылықты орындауда сабыр, күнәдан аулақ болуда сабыр, тағдырдың қиыншылықтарына сабыр.\n\nПайғамбарымыз ﷺ өмірінде талай қиыншылықты сабырмен өткерді. Біз де осы үлгіні алайық.\n\nАллаһ Тағала бәрімізге сабыр әрі кеңдік берсін.",
        },
        {
          locale: "ru",
          title: "Терпение — путь к успеху",
          summary: "Хутба о награде и значении терпения перед жизненными трудностями.",
          body: "Бисмилляхи-р-Рахмани-р-Рахим.\n\nЖизнь полна испытаний. Аллах Всевышний испытывает нас разными обстоятельствами: здоровьем, имуществом, потерей близких.\n\nВ Священном Коране сказано: «Поистине, терпеливым будет полностью воздана их награда без счёта». Терпение — это не роптать перед трудностью, не впадать в неверие и быть довольным предопределением Аллаха.\n\nЕсть три вида терпения: терпение в исполнении поклонения, терпение в удержании от греха и терпение перед трудностями судьбы.\n\nПророк ﷺ в своей жизни терпеливо переносил немало испытаний. Последуем и мы этому примеру.\n\nПусть Аллах Всевышний дарует всем нам терпение и облегчение.",
        },
        {
          locale: "en",
          title: "Patience — The Path to Success",
          summary: "A khutbah on the reward and meaning of patience in the face of life's trials.",
          body: "Bismillahir-Rahmanir-Rahim.\n\nLife is full of trials. Allah the Almighty tests us through various circumstances: health, wealth, and the loss of loved ones.\n\nThe Noble Qur'an says: \"Indeed, the patient will be given their reward without account.\" Patience means not complaining in hardship, not falling into disbelief, and being content with Allah's decree.\n\nThere are three kinds of patience: patience in performing worship, patience in avoiding sin, and patience with the hardships of fate.\n\nThe Prophet ﷺ endured many trials in his life with patience. Let us follow this example as well.\n\nMay Allah the Almighty grant all of us patience and relief.",
        },
      ],
    },
    {
      mosqueSlug: "abu-bakr",
      slug: "ata-ana-2026-07-24",
      date: new Date("2026-07-24"),
      originalLocale: "kk",
      translations: [
        {
          locale: "kk",
          title: "Ата-анаға жақсылық жасау",
          summary:
            "Ата-ана алдындағы парыз бен олармен қарым-қатынасты жақсартудың сауабы туралы хұтба.",
          body: "Бисмиллаһир-Рахманир-Рахим.\n\nҚадірлі мұсылман бауырлар! Аллаһ Тағала Құран Кәрімде Өзіне құлшылық етуден кейін бірден ата-анаға жақсылық жасауды бұйырады: «Раббың тек қана Өзіне құлшылық етуді және ата-анаға жақсылық жасауды үкім етті» (Исра сүресі, 23-аят).\n\nБір сахаба Пайғамбарымыздан ﷺ: «Кімге жақсылық жасауым керектігі?» деп сұрағанда, ол үш рет «Анаңа» деп жауап беріп, төртінші рет қана «Әкеңе» деген. Бұл — ана орнының исламда қаншалықты жоғары екенін көрсетеді.\n\nАта-анаға жақсылық — тек материалдық көмек емес. Оларға жұмсақ сөйлеу, дауыс көтермеу, кеңесіне құлақ асу, кәрілік шағында қамқорлық жасау — осының бәрі парыз.\n\nПайғамбарымыз ﷺ: «Ата-анасына жеткен, содан кейін жәннатқа кірмеген адамның мұрны жерге тиіп қалсын» деп үш рет қайталаған. Бұл — ата-ана ризалығының ақиретте қаншалықты маңызды екенін ескертетін қатаң сөз.\n\nБүгіннен бастап ата-анамызға көбірек хабарласайық, оларға уақыт бөлейік, дұғаларымызда ұмытпайық.\n\nАллаһ Тағала бәрімізді ата-анасына жақсылық жасаушылардан етсін.",
        },
        {
          locale: "ru",
          title: "Благочестие к родителям",
          summary:
            "Хутба о долге перед родителями и о награде за укрепление отношений с ними.",
          body: "Бисмилляхи-р-Рахмани-р-Рахим.\n\nДорогие братья и сестры! Аллах Всевышний в Коране повелевает делать добро родителям сразу же после поклонения Ему: «Господь твой повелел, чтобы вы поклонялись только Ему и делали добро родителям» (сура «Аль-Исра», 23).\n\nКогда один из сподвижников спросил Пророка ﷺ, к кому он должен относиться лучше всего, тот трижды ответил: «К твоей матери», и лишь в четвёртый раз сказал: «К твоему отцу». Это показывает, насколько высоко в исламе положение матери.\n\nБлагочестие к родителям — это не только материальная помощь. Это мягкая речь, отсутствие повышенного тона, прислушивание к их советам и забота о них в старости.\n\nПророк ﷺ трижды повторил: «Да будет унижен тот, кто застал своих родителей — одного из них или обоих — в старости, и это не привело его в Рай». Это суровое напоминание о том, насколько важно довольство родителей для нашей вечной жизни.\n\nНачнём с сегодняшнего дня чаще звонить родителям, уделять им время и не забывать о них в своих молитвах.\n\nПусть Аллах сделает всех нас благочестивыми по отношению к своим родителям.",
        },
        {
          locale: "en",
          title: "Kindness to Parents",
          summary:
            "A khutbah on our duty toward our parents and the reward for strengthening ties with them.",
          body: "Bismillahir-Rahmanir-Rahim.\n\nDear brothers and sisters! In the Qur'an, Allah the Almighty commands kindness to parents immediately after commanding worship of Him alone: \"Your Lord has decreed that you worship none but Him, and that you be kind to parents\" (Surah Al-Isra, 23).\n\nWhen a companion asked the Prophet ﷺ who most deserved his good companionship, he answered three times, \"Your mother,\" and only on the fourth time said, \"Your father.\" This shows how exalted the status of the mother is in Islam.\n\nKindness to parents is not only material support. It is speaking gently, never raising one's voice at them, listening to their counsel, and caring for them in old age.\n\nThe Prophet ﷺ said three times: \"Humiliated is the one who found one or both of his parents in old age and it did not lead him into Paradise.\" This is a stern reminder of how central our parents' pleasure is to our life in the Hereafter.\n\nLet us start today by calling our parents more often, giving them our time, and remembering them in our prayers.\n\nMay Allah make all of us dutiful toward our parents.",
        },
      ],
    },
    {
      mosqueSlug: "abu-bakr",
      slug: "amanat-2026-07-31",
      date: new Date("2026-07-31"),
      originalLocale: "kk",
      translations: [
        {
          locale: "kk",
          title: "Аманат пен шыншылдық",
          summary:
            "Сауда-саттықта, сөзде және іс-әрекетте аманатты сақтау мен шыншыл болудың маңызы туралы хұтба.",
          body: "Бисмиллаһир-Рахманир-Рахим.\n\nҚадірлі мұсылман бауырлар! Аманат пен шыншылдық — мұсылманның ажырамас қасиеттерінің бірі. Аллаһ Тағала: «Аллаһ сендерге аманаттарды иелеріне қайтаруды бұйырады» дейді (Ниса сүресі, 58-аят).\n\nПайғамбарымыз ﷺ: «Шыншыл әрі сенімді саудагер пайғамбарлармен, шыншылдармен және шейіттермен бірге болады» деген. Бұл — сауда-саттықта адалдықтың қаншалықты жоғары бағаланатынын көрсетеді.\n\nАманат — тек материалдық зат емес. Уәдені орындау, құпияны сақтау, лауазымды әділ пайдалану, өлшем мен таразыда алдамау — осының бәрі аманатқа кіреді.\n\nМунафиктің үш белгісінің бірі — сөйлегенде өтірік айту, уәде бергенде бұзу, аманат етілгенде опасыздық жасау деп Пайғамбарымыз ﷺ ескерткен. Бұл сипаттардан аулақ болуға тырысайық.\n\nШыншылдық — тар жол болса да, ақыр соңында құтқарады. Өтірік — жеңіл көрінгенімен, апатқа апарады.\n\nАллаһ Тағала бізді аманатшыл әрі шыншыл құлдарынан етсін.",
        },
        {
          locale: "ru",
          title: "Доверие и правдивость",
          summary:
            "Хутба о важности хранить доверенное и быть правдивым в торговле, речи и поступках.",
          body: "Бисмилляхи-р-Рахмани-р-Рахим.\n\nДорогие братья и сестры! Доверие (амана) и правдивость — неотъемлемые качества мусульманина. Аллах Всевышний говорит: «Аллах повелевает вам возвращать вверенное на хранение имущество его владельцам» (сура «Ан-Ниса», 58).\n\nПророк ﷺ сказал: «Правдивый и честный торговец будет вместе с пророками, правдивыми и мучениками». Это показывает, насколько высоко ценится честность в торговых делах.\n\nДоверие — это не только материальные вещи. Выполнение обещаний, хранение тайн, справедливое использование должности, отсутствие обмана в мере и весе — всё это часть амана.\n\nПророк ﷺ предупредил, что один из трёх признаков лицемера — это ложь в речи, нарушение обещания и предательство доверенного. Постараемся держаться подальше от этих качеств.\n\nПравдивость, даже если путь узок, в конце концов спасает. Ложь, даже если кажется лёгкой, ведёт к беде.\n\nПусть Аллах сделает нас Своими рабами, хранящими доверенное и правдивыми.",
        },
        {
          locale: "en",
          title: "Trust and Truthfulness",
          summary:
            "A khutbah on the importance of honoring what is entrusted to us and being truthful in trade, speech, and deeds.",
          body: "Bismillahir-Rahmanir-Rahim.\n\nDear brothers and sisters! Trustworthiness (amanah) and truthfulness are inseparable qualities of a believer. Allah the Almighty says: \"Indeed, Allah commands you to render trusts to whom they are due\" (Surah An-Nisa, 58).\n\nThe Prophet ﷺ said: \"The truthful, trustworthy merchant will be with the prophets, the truthful, and the martyrs.\" This shows how highly honesty in trade is valued.\n\nTrust is not only about material things. Keeping promises, guarding secrets, using one's position fairly, and not cheating in measure and weight — all of this falls under amanah.\n\nThe Prophet ﷺ warned that among the signs of a hypocrite are lying in speech, breaking promises, and betraying what is entrusted. Let us strive to stay far from these traits.\n\nTruthfulness, even when the path is narrow, ultimately saves a person. Falsehood, even when it seems easy, leads to ruin.\n\nMay Allah make us among His servants who are trustworthy and truthful.",
        },
      ],
    },
    {
      mosqueSlug: "abu-bakr",
      slug: "gaybat-2026-08-07",
      date: new Date("2026-08-07"),
      originalLocale: "kk",
      translations: [
        {
          locale: "kk",
          title: "Ғайбаттан аулақ болу",
          summary: "Артынан сөйлеу мен өсек-аяңның зияны және одан сақтанудың жолдары туралы хұтба.",
          body: "Бисмиллаһир-Рахманир-Рахим.\n\nҚадірлі мұсылман бауырлар! Ғайбат — яғни, адамның артынан оған ұнамайтын нәрсені айту — исламда қатаң тыйым салынған үлкен күнәлардың бірі. Аллаһ Тағала Құранда мұны өлген бауырының етін жеумен теңейді: «Сендердің кейбіреуің бауырының өлі етін жегісі келе ме? Бұдан жиіркенесіңдер ғой!» (Хужурат сүресі, 12-аят).\n\nБұл теңеу — ғайбаттың адам жанына қаншалықты жат әрі жиіркенішті екенін көрсетеді. Дегенмен, бүгінгі күні бұл күнә әңгіме-дүкен арасында, тіпті әзіл ретінде де жиі кездеседі.\n\nПайғамбарымыз ﷺ: «Мұсылман — мұсылманның тілінен және қолынан басқа мұсылмандар аман болатын кісі» деген. Тіліміз бен жазуымызды бақылауымыз керек, әсіресе әлеуметтік желілерде.\n\nҒайбаттан сақтанудың жолы — біреу туралы жаман сөз айтылғанда тыңдамай, тақырыпты ауыстыру, немесе сол адамды жақсы сөзбен қорғау. Егер өзіміз айтып қойсақ, кешірім сұрап, тәубе етуіміз керек.\n\nТілімізді сақтау — иманымыздың бір белгісі. Көбірек сөйлегеннен гөрі, көбірек ойланып сөйлейік.\n\nАллаһ Тағала бізді тілін сақтаған құлдарынан етсін.",
        },
        {
          locale: "ru",
          title: "Остерегаться сплетен",
          summary: "Хутба о вреде злословия за спиной и о том, как уберечься от этого греха.",
          body: "Бисмилляхи-р-Рахмани-р-Рахим.\n\nДорогие братья и сестры! Гыйба — то есть упоминание человека в его отсутствие в том, что ему не понравилось бы, — один из тяжких грехов, строго запрещённых в исламе. Аллах Всевышний в Коране сравнивает это с поеданием мяса умершего брата: «Разве понравится кому-нибудь из вас есть мясо своего покойного брата? Вы ведь испытываете к этому отвращение» (сура «Аль-Худжурат», 12).\n\nЭто сравнение показывает, насколько сплетни чужды и отвратительны человеческой душе. Тем не менее, сегодня этот грех часто встречается в разговорах и даже в шутках.\n\nПророк ﷺ сказал: «Мусульманин — это тот, от чьего языка и рук другие мусульмане находятся в безопасности». Нам следует следить за своим языком и за тем, что мы пишем, особенно в социальных сетях.\n\nСпастись от гыйбы можно, не слушая плохие слова о ком-то, меняя тему разговора или заступаясь за этого человека добрым словом. Если же мы сами это сказали, нужно попросить прощения и раскаяться.\n\nХранение языка — один из признаков веры. Будем говорить меньше, но обдуманнее.\n\nПусть Аллах сделает нас из числа тех, кто хранит свой язык.",
        },
        {
          locale: "en",
          title: "Guarding Against Backbiting",
          summary: "A khutbah on the harm of speaking ill of others behind their backs and how to avoid this sin.",
          body: "Bismillahir-Rahmanir-Rahim.\n\nDear brothers and sisters! Backbiting (gheebah) — mentioning someone in their absence in a way they would dislike — is one of the major sins strictly forbidden in Islam. Allah the Almighty compares it in the Qur'an to eating the flesh of one's dead brother: \"Would one of you like to eat the flesh of his dead brother? You would detest it\" (Surah Al-Hujurat, 12).\n\nThis comparison shows how foreign and repulsive backbiting is to the human soul. Yet today this sin is common in everyday conversation, even disguised as humor.\n\nThe Prophet ﷺ said: \"A Muslim is the one from whose tongue and hand other Muslims are safe.\" We must watch our tongues and what we write, especially on social media.\n\nOne can guard against backbiting by refusing to listen to ill words about someone, changing the subject, or defending that person with a kind word. If we have already spoken ill of someone, we should seek forgiveness and repent.\n\nGuarding one's tongue is a sign of faith. Let us speak less, and speak with more thought.\n\nMay Allah make us among those who guard their tongues.",
        },
      ],
    },
  ];

  const mosqueBySlug = { baiken, "abu-bakr": abuBakr } as const;

  for (const k of khutbahs) {
    await prisma.khutbah.create({
      data: {
        mosqueId: mosqueBySlug[k.mosqueSlug as keyof typeof mosqueBySlug].id,
        slug: k.slug,
        date: k.date,
        originalLocale: k.originalLocale,
        published: true,
        translations: { create: k.translations },
      },
    });
  }
  console.log(`Seeded ${khutbahs.length} khutbahs (split across ${mosques.length} mosques)`);

  for (const ayah of alKahfAyahs) {
    await prisma.quranAyah.create({
      data: {
        surahNumber: 18,
        ayahNumber: ayah.number,
        textArabic: ayah.arabic,
        transliteration: ayah.transliteration,
        translations: {
          create: [
            { locale: "ru", text: ayah.ru },
            { locale: "en", text: ayah.en },
          ],
        },
      },
    });
  }
  console.log(`Seeded ${alKahfAyahs.length} Al-Kahf ayahs`);

  type Block = {
    category: "SUNNAH" | "RECOMMENDED_ACTION" | "REMINDER" | "FRIDAY_VIRTUE" | "AL_KAHF";
    order: number;
    translations: { locale: string; title: string; body: string }[];
  };

  const blocks: Block[] = [
    {
      category: "SUNNAH",
      order: 1,
      translations: [
        { locale: "kk", title: "Ғұсыл алу", body: "Жұма күні толық дәрет алып (ғұсыл), таза киіммен мешітке бару — сүннет амалдардың бірі." },
        { locale: "ru", title: "Совершить полное омовение (гусль)", body: "В пятницу желательно совершить полное омовение (гусль) и прийти в мечеть в чистой одежде." },
        { locale: "en", title: "Perform ghusl (ritual bath)", body: "On Friday it is recommended to perform a full ritual bath (ghusl) and come to the mosque in clean clothes." },
      ],
    },
    {
      category: "SUNNAH",
      order: 2,
      translations: [
        { locale: "kk", title: "Мешітке ерте келу", body: "Хұтба басталғанға дейін мешітке ерте келіп, дұға мен зікірмен уақыт өткізу үлкен сауапты іс." },
        { locale: "ru", title: "Прийти в мечеть заблаговременно", body: "Прийти в мечеть заранее, до начала хутбы, и провести время в мольбе и поминании Аллаха — большое благо." },
        { locale: "en", title: "Come to the mosque early", body: "Arriving at the mosque well before the khutbah begins, spending the time in supplication and remembrance, carries great reward." },
      ],
    },
    {
      category: "SUNNAH",
      order: 3,
      translations: [
        { locale: "kk", title: "Хош иіс бен таза киім", body: "Жұма намазына хош иіс сеуіп, таза әрі әдемі киіммен бару Пайғамбарымыздың ﷺ сүннеті." },
        { locale: "ru", title: "Благовония и опрятная одежда", body: "Использовать благовония и надевать чистую, опрятную одежду на пятничную молитву — сунна Пророка ﷺ." },
        { locale: "en", title: "Perfume and clean clothing", body: "Wearing perfume and clean, presentable clothing for the Friday prayer is a sunnah of the Prophet ﷺ." },
      ],
    },
    {
      category: "RECOMMENDED_ACTION",
      order: 1,
      translations: [
        { locale: "kk", title: "Пайғамбарымызға көп салауат айту", body: "Жұма күні мен түнінде Пайғамбарымызға ﷺ көбірек салауат айту ұсынылады." },
        { locale: "ru", title: "Чаще произносить салават", body: "В пятницу и в ночь на пятницу рекомендуется чаще произносить салават Пророку ﷺ." },
        { locale: "en", title: "Send more blessings on the Prophet", body: "On Friday and the night before it, it is recommended to send abundant blessings (salawat) upon the Prophet ﷺ." },
      ],
    },
    {
      category: "RECOMMENDED_ACTION",
      order: 2,
      translations: [
        { locale: "kk", title: "Садақа беру", body: "Мүмкіндігінше жұма күні садақа беру — сауабы көбейтілетін амалдардың бірі." },
        { locale: "ru", title: "Раздать милостыню (садака)", body: "По возможности раздавать милостыню в пятницу — один из поступков с умноженной наградой." },
        { locale: "en", title: "Give charity (sadaqah)", body: "Giving charity on Friday, when possible, is an act whose reward is multiplied." },
      ],
    },
    {
      category: "REMINDER",
      order: 1,
      translations: [
        { locale: "kk", title: "Ду‘а қабыл болатын сағат", body: "Жұма күнінде дұғаның қабыл болатын ерекше бір сәті бар — сол сәтті дұғамен өткізуге тырысыңыз." },
        { locale: "ru", title: "Час принятия мольбы", body: "В пятницу есть особый момент, когда мольба принимается — постарайтесь провести это время в мольбе Аллаху." },
        { locale: "en", title: "The hour when supplication is answered", body: "There is a special hour on Friday when supplication is accepted — try to spend that time in du'a." },
      ],
    },
    {
      category: "FRIDAY_VIRTUE",
      order: 1,
      translations: [
        { locale: "kk", title: "Аптаның ең қайырлы күні", body: "Пайғамбарымыз ﷺ: «Күн шыққан күндердің ішіндегі ең қайырлысы — жұма күні» деген. Осы күні Адам ата жаратылған, жәннатқа кіргізілген." },
        { locale: "ru", title: "Лучший день недели", body: "Пророк ﷺ сказал: «Лучший день, в который взошло солнце, — это пятница». В этот день был создан Адам и введён в Рай." },
        { locale: "en", title: "The best day of the week", body: "The Prophet ﷺ said: \"The best day on which the sun rises is Friday.\" On this day Adam was created and entered Paradise." },
      ],
    },
    {
      category: "AL_KAHF",
      order: 1,
      translations: [
        { locale: "kk", title: "Неге жұма сайын оқимыз", body: "Пайғамбарымыз ﷺ: «Кім жұма күні Кахф сүресін оқыса, оған екі жұманың арасында нұр жарқырайды» деген. Толық мәтін — оригинал, транскрипция және аударма — осы беттің төменгі жағында." },
        { locale: "ru", title: "Почему мы читаем её каждую пятницу", body: "Пророк ﷺ сказал: «Кто прочитает суру Аль-Кахф в пятницу, тому воссияет свет между двумя пятницами». Полный текст — оригинал, транскрипция и перевод — ниже на этой странице." },
        { locale: "en", title: "Why we read it every Friday", body: "The Prophet ﷺ said: \"Whoever recites Surah Al-Kahf on Friday will have a light that shines between the two Fridays.\" The full text — original, transliteration, and translation — is below on this page." },
      ],
    },
  ];

  // Сунны/напоминания и т.п. — общечеловеческий исламский контент, но по архитектуре
  // (см. решение о мультимечетности) хранится отдельной копией на каждую мечеть,
  // чтобы у каждой мечети был полный набор материалов с самого начала.
  for (const mosque of [baiken, abuBakr]) {
    for (const b of blocks) {
      await prisma.contentBlock.create({
        data: {
          mosqueId: mosque.id,
          category: b.category,
          order: b.order,
          published: true,
          translations: { create: b.translations },
        },
      });
    }
  }
  console.log(`Seeded ${blocks.length} content blocks × ${mosques.length} mosques`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
