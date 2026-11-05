// All interface text, side by side per language. Ukrainian is the default and the fallback for any missing English key.
// Event, organization and topic text lives in data/ (English overlay in data/en/), not here.
export const LOCALES = ["uk", "en"] as const;
export type Lang = (typeof LOCALES)[number];
export const DEFAULT_LANG: Lang = "uk";

// Astro derives currentLocale from the URL: /en/... is "en", everything else is the default
export const langOf = (a: { currentLocale?: string }): Lang => (a.currentLocale === "en" ? "en" : DEFAULT_LANG);

const uk = {
  "nav.home": "Головна",
  "nav.events": "Події",
  "nav.orgs": "Організації",
  "nav.aria": "Основна навігація",
  "theme.toggle": "Світла тема",
  "lang.aria": "Мова",

  "meta.description": "Щорічні події у Львові: фестивалі, форуми, конференції та ініціативи.",
  "foot.about": "Щорічні фестивалі, форуми й конференції Львова в одному місці. Волонтерський проєкт.",
  "foot.sections": "Розділи",
  "foot.sectionsAria": "Розділи сайту",
  "foot.missingTitle": "Знаєте подію, якої тут немає?",
  "foot.missingText": "Напишіть автору, і її додадуть до списку.",
  "cta.instagram": "Написати в Instagram",
  "foot.top": "Нагору ↑",

  "home.title": "Events Lviv — щорічні події у Львові",
  "home.desc": "Список щорічних подій у Львові: що тут є, чого немає і хто це робить.",
  "hero.sub": "Щорічні події у Львові",
  "hero.kinds": "Фестивалі · Конференції · Форуми · Ініціативи",
  "hero.cta": "Переглянути події",
  "hero.about": "Про проєкт",
  "about.eyebrow": "Про проєкт",
  "about.lead":
    "Всім привіт. Вітаю у списку львівських подій. Список був створений для людей, які бажають дізнатись більше про те, що відбувається у Львові протягом року. Мета — поширити інформацію про різні ініціативи та показати, що Львів — це місто ініціатив, розвитку та майбутнього.",
  "stat.events": "подій",
  "stat.orgs": "організацій",
  "stat.topics": "тематик",
  "panel1.title": "Що тут можна побачити",
  "panel1.text":
    "Щорічні події, фестивалі, форуми, збори, конференції, які охоплюють велику частину людей (як вузькопрофільних у чомусь, так і на загал). Події однієї організації зібрані на її сторінці, окремі унікальні події подані самостійно.",
  "panel2.title": "Що я можу дізнатись про подію",
  "panel2.text":
    "Кожна подія розписана за шаблоном: невеликий опис, цільова аудиторія, місце проведення, час та умови входу. Для детальнішої інформації є посилання на подію або на компанії-організаторів. До кожної події надані фотографії для кращого розуміння.",
  "not.title": "Чого тут немає",
  "not.lead": "У цьому списку ви не зможете знайти таких подій:",
  "not.1": "Події від університетів (наприклад, Весна політехніки, день кар’єри)",
  "not.2": "Концерти окремих виконавців",
  "not.3": "Релігійні події (наприклад, ЛЕВЕЛ)",
  "not.4": "Табори, курси, стажування",
  "not.5": "Різні Speaking Clubs і таке інше",
  "vol.title": "Проєкт створений лише на волонтерських засадах",
  "vol.text":
    "Список оновлюється нерегулярно, але автор старається підтримувати його додаванням нових подій та підтримуванням достовірності інформації. Відкритий для скарг та пропозицій. Ми всі люди і помилки можуть бути. Поставтесь, будь ласка, з розумінням.",
  "author.eyebrow": "Про автора",
  "author.text":
    "Привіт! Мене звати TheDeiw. Я живу у Львові й обожнюю його ритм. Мені завжди бракувало єдиного місця, де були б зібрані всі круті періодичні події міста, тому я вирішив створити його сам. Цей список — мій особистий проєкт, створений з любов’ю до Львова та його людей.",
  "join.title": "Нумо разом створимо найкращий гід по івентах Львова!",
  "join.text":
    "Цей проєкт почався з моєї ініціативи, але я вірю, що кращим він стане лише завдяки вам. Найкращим способом буде зв’язатись через Instagram.",

  "events.title": "Події",
  "events.metaTitle": "Події — Events Lviv",
  "events.metaDesc": "Усі щорічні події Львова: фільтри за темою, організатором, входом і порою року.",
  "events.count": "{n} з {total} подій",
  "events.filters": "Фільтри",
  "events.reset": "Скинути фільтри",
  "events.empty": "За цими фільтрами нічого не знайшлося.",
  "events.listAria": "Список подій",

  "f.search": "Пошук",
  "f.searchAria": "Пошук за назвою або організатором",
  "f.topic": "Тематика",
  "f.all": "Усі",
  "f.org": "Організатор",
  "f.allOrgs": "Усі організації",
  "f.entry": "Вхід",
  "f.any": "Будь-який",
  "f.free": "Безкоштовно",
  "f.paid": "Платно",
  "f.when": "Коли",
  "f.year": "Весь рік",
  "f.spring": "Весна",
  "f.summer": "Літо",
  "f.autumn": "Осінь",
  "f.winter": "Зима",

  "card.org": "Організатор: ",
  "card.when": "Коли: ",
  "card.entry": "Вхід: ",
  "entry.free": "Безкоштовно",
  "entry.paid": "Платно",
  "entry.mixed": "Залежить",
  "when.year": "протягом року",
  "when.tbd": "дата уточнюється",
  "link.site": "Сайт",

  "ev.back": "← Усі події",
  "ev.org": "Організатор: ",
  "ev.desc": "Опис",
  "ev.audience": "Цільова аудиторія",
  "ev.photos": "Фото з події",
  "ev.when": "Коли",
  "ev.where": "Де",
  "ev.price": "Скільки",
  "ev.links": "Посилання",

  "orgs.title": "Організації",
  "orgs.metaTitle": "Організації — Events Lviv",
  "orgs.metaDesc": "Організації, які проводять щорічні події у Львові, та їхні події.",
  "orgs.count": "{n} організацій, які проводять події у Львові",
  "orgs.back": "← Усі організації",
  "org.spaces": "Простори",
  "org.events": "Події ({n})",
};

const en: Record<keyof typeof uk, string> = {
  "nav.home": "Home",
  "nav.events": "Events",
  "nav.orgs": "Organizations",
  "nav.aria": "Main navigation",
  "theme.toggle": "Light theme",
  "lang.aria": "Language",

  "meta.description": "Annual events in Lviv: festivals, forums, conferences and initiatives.",
  "foot.about": "Lviv's annual festivals, forums and conferences in one place. A volunteer project.",
  "foot.sections": "Sections",
  "foot.sectionsAria": "Site sections",
  "foot.missingTitle": "Know an event that's missing?",
  "foot.missingText": "Write to the author and it will be added to the list.",
  "cta.instagram": "Message on Instagram",
  "foot.top": "Back to top ↑",

  "home.title": "Events Lviv — annual events in Lviv",
  "home.desc": "A list of annual events in Lviv: what is here, what is not, and who is behind it.",
  "hero.sub": "Annual events in Lviv",
  "hero.kinds": "Festivals · Conferences · Forums · Initiatives",
  "hero.cta": "Browse events",
  "hero.about": "About the project",
  "about.eyebrow": "About the project",
  "about.lead":
    "Hello everyone, and welcome to the list of Lviv events. It was created for people who want to learn more about what happens in Lviv throughout the year. The goal is to spread the word about different initiatives and to show that Lviv is a city of initiative, growth and future.",
  "stat.events": "events",
  "stat.orgs": "organizations",
  "stat.topics": "topics",
  "panel1.title": "What you can find here",
  "panel1.text":
    "Annual events, festivals, forums, gatherings and conferences that reach a large share of people, both niche audiences and the general public. Events of one organization are collected on its page, while standalone one-off events are listed on their own.",
  "panel2.title": "What I can learn about an event",
  "panel2.text":
    "Every event follows the same template: a short description, target audience, venue, time and entry conditions. For more detail there are links to the event or to the organizing companies. Each event comes with photos for a better idea of what it is like.",
  "not.title": "What is not here",
  "not.lead": "You will not find these kinds of events in this list:",
  "not.1": "University events (for example, Spring of Polytechnic, career day)",
  "not.2": "Concerts of individual performers",
  "not.3": "Religious events (for example, LEVEL)",
  "not.4": "Camps, courses, internships",
  "not.5": "Speaking clubs and the like",
  "vol.title": "The project is run on a volunteer basis only",
  "vol.text":
    "The list is updated irregularly, but the author does their best to keep it going by adding new events and keeping the information accurate. Open to complaints and suggestions. We are all human and mistakes can happen. Please be understanding.",
  "author.eyebrow": "About the author",
  "author.text":
    "Hi! My name is TheDeiw. I live in Lviv and love its rhythm. I always missed a single place where all the cool recurring events of the city were gathered, so I decided to build it myself. This list is my personal project, made with love for Lviv and its people.",
  "join.title": "Let's build the best guide to Lviv events together!",
  "join.text":
    "This project started with my initiative, but I believe it will only get better thanks to you. The best way to reach me is through Instagram.",

  "events.title": "Events",
  "events.metaTitle": "Events — Events Lviv",
  "events.metaDesc": "All annual events in Lviv: filter by topic, organizer, entry and season.",
  "events.count": "{n} of {total} events",
  "events.filters": "Filters",
  "events.reset": "Reset filters",
  "events.empty": "Nothing found for these filters.",
  "events.listAria": "List of events",

  "f.search": "Search",
  "f.searchAria": "Search by name or organizer",
  "f.topic": "Topic",
  "f.all": "All",
  "f.org": "Organizer",
  "f.allOrgs": "All organizations",
  "f.entry": "Entry",
  "f.any": "Any",
  "f.free": "Free",
  "f.paid": "Paid",
  "f.when": "When",
  "f.year": "All year",
  "f.spring": "Spring",
  "f.summer": "Summer",
  "f.autumn": "Autumn",
  "f.winter": "Winter",

  "card.org": "Organizer: ",
  "card.when": "When: ",
  "card.entry": "Entry: ",
  "entry.free": "Free",
  "entry.paid": "Paid",
  "entry.mixed": "Varies",
  "when.year": "year-round",
  "when.tbd": "date to be confirmed",
  "link.site": "Website",

  "ev.back": "← All events",
  "ev.org": "Organizer: ",
  "ev.desc": "Description",
  "ev.audience": "Target audience",
  "ev.photos": "Photos from the event",
  "ev.when": "When",
  "ev.where": "Where",
  "ev.price": "Price",
  "ev.links": "Links",

  "orgs.title": "Organizations",
  "orgs.metaTitle": "Organizations — Events Lviv",
  "orgs.metaDesc": "Organizations that run annual events in Lviv, and their events.",
  "orgs.count": "{n} organizations that run events in Lviv",
  "orgs.back": "← All organizations",
  "org.spaces": "Spaces",
  "org.events": "Events ({n})",
};

const ui = { uk, en };
export type Key = keyof typeof uk;
export const t = (lang: Lang) => (key: Key): string => ui[lang][key] ?? uk[key];
// "{n} з {total} подій" + { n: 3, total: 41 }
export const fill = (s: string, v: Record<string, string | number>) => s.replace(/\{(\w+)\}/g, (_, k) => String(v[k]));

export const MON: Record<Lang, string[]> = {
  uk: ["січ", "лют", "бер", "кві", "тра", "чер", "лип", "сер", "вер", "жов", "лис", "гру"],
  en: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
};

const EVENT_FORMS: Record<Lang, Record<string, string>> = {
  uk: { one: "подія", few: "події", many: "подій", other: "події" },
  en: { one: "event", other: "events" },
};
// "1 подія, 2 події, 5 подій, 21 подія" / "1 event, 2 events"
export const eventsWord = (n: number, lang: Lang) => EVENT_FORMS[lang][new Intl.PluralRules(lang).select(n)] ?? EVENT_FORMS[lang].other;
