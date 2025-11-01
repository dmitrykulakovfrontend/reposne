# Mama HR – Backend (Node.js/Express) – ТЗ для разработчика

Цель: принять заявки из формы списка ожидания, валидировать/защищать от ботов, отправлять уведомление в Telegram и (опционально) сохранять в БД/таблицу.

## Технологии
- Node.js 20+
- Express 4+
- Zod (валидация схем)
- Helmet (безопасность заголовков)
- CORS (белый список доменов)
- rate-limiter-flexible (лимиты запросов)
- Axios (вызов Telegram API)
- (Опционально) Prisma + SQLite/Postgres или запись в CSV/Google Sheets

## Переменные окружения (.env)
- PORT=8080
- TELEGRAM_BOT_TOKEN=...
- TELEGRAM_CHAT_ID=... (id чата/канала/группы)
- ALLOWED_ORIGINS=https://mamahr.site, http://localhost:8000
- RATE_POINTS=5 (запросов)
- RATE_DURATION=60 (секунд)
- HCAPTCHA_SECRET=... (опционально, если добавим hCaptcha)

## Эндпоинты
POST /api/waitlist
- Body (JSON):
  {
    "name": string (2..80),
    "email": string (email, <= 120),
    "role": enum("student","parent","company"),
    "description": string (<= 1000, optional),
    "honeypot": string (должен быть пустым),
    "human": boolean,
    "userAgent": string (optional),
    "referrer": string (optional),
    "url": string (optional),
    "hcaptchaToken": string (optional)
  }

- Валидация:
  - name: trim, длина 2..80
  - email: формат email
  - role: одно из: student | parent | company
  - description: trim, <= 1000
  - honeypot: ДОЛЖЕН БЫТЬ пустым
  - human: true
  - (если включен hCaptcha) проверить hcaptchaToken через серверный секрет

- Защита:
  - rate limit по IP (например, 5/мин)
  - reject, если honeypot не пустой
  - reject, если human=false
  - UA sanity check (опционально)

- Действия:
  1) Сформировать текст и отправить в Telegram (sendMessage)
  2) (Опционально) Сохранить запись в БД/CSV/Sheets
  3) Вернуть 200 { ok: true, position?: number }

- Ответы:
  - 200: { ok: true }
  - 400: { ok: false, error: "validation_error", details }
  - 429: { ok: false, error: "rate_limited" }
  - 500: { ok: false, error: "internal_error" }

## Telegram
POST https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage
- chat_id: TELEGRAM_CHAT_ID
- parse_mode: MarkdownV2
- text: собрать из полей, экранировать спецсимволы

## CORS
- Разрешить только ALLOWED_ORIGINS
- Разрешить метод POST и заголовки: Content-Type, Authorization

## Пример текста для Telegram
```
Новая заявка в лист ожидания
— Роль: student
— Имя: Иван
— Email: ivan@example.com
— Описание: Хочу найти стажировку в бэкенде
— UA: Mozilla/5.0 ...
— Ref: https://...
```

## Структура проекта
```
/src
  /routes
    waitlist.ts  // POST /api/waitlist
  /lib
    telegram.ts  // sendToTelegram(), escapeMarkdown()
    captcha.ts   // verifyHCaptcha()
  app.ts         // express, helmet, cors, limiter, routes
  server.ts      // http.listen()
```

## Деплой (Railway пример)
1) Репозиторий → Railway → New Project → Deploy from GitHub
2) Add Variables: TELEGRAM_BOT_TOKEN, TELEGRAM_CHAT_ID, ALLOWED_ORIGINS
3) Start Command: node dist/server.js (или ts-node src/server.ts)
4) Подключить бесплатную Postgres, если нужна персистентность

## Интеграция с фронтендом
— Фронт отправляет POST на /api/waitlist JSON.
— Текущая форма уже собирает поля (name, email, role, description, human, honeypot, UA, referrer, url). Добавим использование API вместо прямого Telegram на клиенте, когда сервер будет готов.

## Что сейчас «капча не работает» означает
На фронте стоит упрощённая защита: чекбокс «я не робот» + honeypot. Это не полноценная капча. Настоящая защита должна проверяться на сервере (hCaptcha/рекапча), плюс rate limit и honeypot. В этом ТЗ указано, как это сделать на бэкенде.

## Дальнейшие улучшения
- Подтверждение email (double opt‑in)
- Админ-панель выгрузки заявок
- Подписка в Telegram канал/группу (invites)
- Логи и алерты (Sentry/Logtail)



