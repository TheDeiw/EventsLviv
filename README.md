<div align="center">

<img src="public/hero/disc.webp" width="150" alt="Логотип Events Lviv">

# Events Lviv

**Щорічні події у Львові в одному місці**<br>
Фестивалі · конференції · форуми · ініціативи

![Astro](https://img.shields.io/badge/Astro-7-ff5d01?logo=astro&logoColor=white)
![Статичний сайт](https://img.shields.io/badge/сайт-статичний-34a853)
![Мова](https://img.shields.io/badge/мова-українська-e9c53b)

</div>

<table>
  <tr>
    <td><img src="docs/screenshot-home.jpg" alt="Головна сторінка"></td>
    <td><img src="docs/screenshot-events.jpg" alt="Список подій з фільтрами"></td>
  </tr>
</table>

## Що це

Список щорічних подій Львова для тих, хто хоче знати, що відбувається в місті протягом року. Кожна подія розписана за однаковим шаблоном: опис, для кого, де, коли, умови входу, посилання й фотографії. Події однієї організації зібрані на її сторінці.

Проєкт волонтерський і розвивається нерегулярно. Нову подію чи виправлення можна запропонувати автору в [Instagram](https://www.instagram.com/the_deiw_/).

## Що вміє сайт

- **Список подій** (`/events/`) з фільтрами, які діють разом: пошук за назвою чи організатором, тематика, організатор, вхід (безкоштовно / платно), пора року.
- **Сторінка кожної події** (`/events/<id>/`) і **сторінки організацій** (`/organizations/<id>/`) з описом та їхніми подіями.
- **Головна** з героєм і текстом про проєкт.
- **Світла й темна тема** без блимання при завантаженні, вибір пам'ятається.
- **Картки-квитки** в кольорах п'яти шпилів львівського логотипа. Обкладинки показуються повністю, без обрізання й розмиття: поля беруться з кольору самої картинки, прозорі логотипи стоять на світлій або темній плитці.
- **Без клієнтського фреймворку.** Усі сторінки збираються в статичний HTML, JavaScript потрібен лише для фільтрів і перемикача теми.
- Паралакс у героєві працює на CSS (`animation-timeline: scroll()`), а при `prefers-reduced-motion` вимикається.

## Швидкий старт

Потрібен [Node.js](https://nodejs.org) 22.22 або новіший.

```bash
npm install
npm run dev
```

Сайт відкриється на <http://localhost:4321>.

| Команда | Що робить |
|---|---|
| `npm run dev` | локальний сервер із живим перезавантаженням |
| `npm run build` | збирає статичний сайт у `dist/` |
| `npm run preview` | показує зібраний `dist/` |
| `npm run covers` | перераховує кольори полів навколо обкладинок (після додавання чи заміни картинок) |

## Дані

Усе, що бачить відвідувач, лежить у `data/`. Це **джерело правди**: список колись був імпортований з Notion, тепер його редагують тут.

| Файл | Вміст |
|---|---|
| `data/events.json` | події |
| `data/organizations.json` | організації (опис, посилання, логотип, простори) |
| `data/topics.json` | тематики та їхні кольори |
| `data/cover-bg.json` | кольори полів навколо обкладинок, генерується `npm run covers` |

### Як додати подію

1. Додайте картинки в `public/images/<id-події>/` (обкладинка `cover.webp`, фото `1.webp`, `2.webp`…).
2. Додайте запис у `data/events.json`:

```jsonc
{
  "id": "molodvizh",                  // стає адресою /events/molodvizh/
  "name": "#Молодвіж",
  "organizationId": "tvory",          // id з organizations.json, або без поля
  "topics": ["youth"],                // it, food, education, forums, charity, culture, youth
  "description": ["Абзац опису…"],
  "audience": "Для кого",
  "place": "Де проходить",
  "whenText": "Щорічно, перша субота вересня.",
  "months": [9],                      // 1–12, потрібні лише для фільтра «пора року»
  "yearRound": false,                 // true: подія триває цілий рік
  "entry": "free",                    // free | paid | mixed
  "priceText": "Участь безкоштовна",
  "links": [{ "title": "Instagram", "url": "https://…", "type": "instagram" }],
  "cover": "images/molodvizh/cover.webp",
  "gallery": ["images/molodvizh/1.webp"]
}
```

3. Запустіть `npm run covers`, щоб порахувати колір полів для нової обкладинки. Для однієї події його можна задати вручну: `"coverBg": "#ffcc00"`.

## Структура

```
data/          події, організації, тематики
design/        DESIGN.md (рішення щодо дизайну), вихідні картинки, порівняння обкладинок
docs/          скриншоти для цього README
public/        favicon, hero-стрічки, картинки подій і організацій
scripts/       cover-colors.mjs: кольори полів навколо обкладинок
src/
  components/  EventCard, Filters, MiniHero
  layouts/     Base: шапка, футер, тема
  lib/site.ts  доступ до даних, посилання з урахуванням base, хелпери
  pages/       /, /events/, /events/<id>/, /organizations/, /organizations/<id>/
  scripts/     filter.ts: логіка фільтрів
  styles/      global.css: змінні тем і спільні стилі
```

Дизайн-рішення (палітра, картка, шапка, hero, обкладинки) описані в [`design/DESIGN.md`](design/DESIGN.md).

## Розгортання

`npm run build` дає звичайні статичні файли в `dist/`, їх можна викласти на будь-який статичний хостинг. Якщо сайт буде жити в підкаталозі (наприклад `/EventsLviv/` на GitHub Pages), додайте `site` і `base` в `astro.config.mjs`. Усі посилання вже будуються через `url()` з `src/lib/site.ts`.

## Автор

[TheDeiw](https://github.com/TheDeiw), Львів · [Instagram](https://www.instagram.com/the_deiw_/) · [LinkedIn](https://www.linkedin.com/in/dmytro-chekhovskyi-81baba291/) · [Портфоліо](https://thedeiw.github.io/TheDeiwPortfolio/)

## Про авторські права

Афіші, логотипи й фотографії подій належать їхнім організаторам і показані з інформаційною метою. Якщо ви організатор і хочете змінити чи прибрати матеріали, напишіть автору. Окремої ліцензії на код поки немає.
