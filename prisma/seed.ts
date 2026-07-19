import "dotenv/config";
import bcrypt from "bcryptjs";
import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaLibSql } from "@prisma/adapter-libsql";

const adapter = new PrismaLibSql({ url: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

async function main() {
  const adminEmail = process.env.SEED_ADMIN_EMAIL ?? "imam@jummatime.kz";
  const adminPassword = process.env.SEED_ADMIN_PASSWORD ?? "ChangeMe123!";
  const adminName = process.env.SEED_ADMIN_NAME ?? "Имам";

  const passwordHash = await bcrypt.hash(adminPassword, 10);
  await prisma.adminUser.upsert({
    where: { email: adminEmail },
    update: {},
    create: { email: adminEmail, name: adminName, passwordHash },
  });
  console.log(`Admin user ready: ${adminEmail}`);

  await prisma.khutbahTranslation.deleteMany();
  await prisma.khutbah.deleteMany();
  await prisma.contentTranslation.deleteMany();
  await prisma.contentBlock.deleteMany();

  const khutbahs = [
    {
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
  ];

  for (const k of khutbahs) {
    await prisma.khutbah.create({
      data: {
        slug: k.slug,
        date: k.date,
        originalLocale: k.originalLocale,
        published: true,
        translations: { create: k.translations },
      },
    });
  }
  console.log(`Seeded ${khutbahs.length} khutbahs`);

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
        { locale: "kk", title: "Неге жұма сайын оқимыз", body: "Пайғамбарымыз ﷺ: «Кім жұма күні Кахф сүресін оқыса, оған екі жұманың арасында нұр жарқырайды» деген. Толық мәтінді сенімді дереккөзден оқу үшін жоғарыдағы сілтемені пайдаланыңыз." },
        { locale: "ru", title: "Почему мы читаем её каждую пятницу", body: "Пророк ﷺ сказал: «Кто прочитает суру Аль-Кахф в пятницу, тому воссияет свет между двумя пятницами». Полный текст читайте по ссылке выше на проверенном источнике." },
        { locale: "en", title: "Why we read it every Friday", body: "The Prophet ﷺ said: \"Whoever recites Surah Al-Kahf on Friday will have a light that shines between the two Fridays.\" Use the link above to read the full text from a trusted source." },
      ],
    },
  ];

  for (const b of blocks) {
    await prisma.contentBlock.create({
      data: {
        category: b.category,
        order: b.order,
        published: true,
        translations: { create: b.translations },
      },
    });
  }
  console.log(`Seeded ${blocks.length} content blocks`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
