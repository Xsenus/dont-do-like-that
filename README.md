# dont-do-like-that

Telegram Mini App + бот, который показывает анимированный жест. Веб‑часть — статика, бот — Telegraf.

## Репо структура

```bash
dont-do-like-that/
  web/            # статика Mini App (index.html)
  bot/            # код бота (Telegraf)
  README.md       # вы здесь
```

- **web/** — отдаётся по HTTPS (например, GitHub Pages).
- **bot/** — запускает Telegram‑бота и выдаёт кнопку `webApp` для открытия Mini App.

---

## 1) Подготовка web (Mini App)

1. Залейте `web/index.html` на HTTPS. Для GitHub Pages:
   - Создайте публичный репозиторий `dont-do-like-that`.
   - Включите **Settings → Pages → Deploy from a branch** → `main` + `/ (root)`.
   - Получите URL: `https://<user>.github.io/dont-do-like-that/` (далее — `WEBAPP_URL`).

Локально можно просто открыть файл — Telegram‑данных не будет, но интерфейс виден.

---

## 2) Подготовка бота

Перейдите в папку `bot/`.

### Установка

```bash
npm install
cp .env.example .env
# откройте .env и задайте:
# BOT_TOKEN=ваш_токен_бота
# WEBAPP_URL=https://<user>.github.io/dont-do-like-that/
```

### Запуск (локально)

```bash
npm run start
```

Напишите боту `/start` — придёт клавиатура с кнопкой **Открыть** (webApp). Нажимаете — запускается Mini App по `WEBAPP_URL`.

> **Без BotFather меню.** Кнопки webApp в сообщениях полностью достаточны для запуска Mini App из чата.

---

## 3) Продакшн-варианты

### Вариант A — **PM2** (VPS, удобно)

1. Установите pm2:

   ```bash
   npm i -g pm2
   ```

2. В `bot/`:

   ```bash
   pm2 start bot.js --name dont-do-like-that-bot
   pm2 save
   pm2 startup    # автозапуск после перезагрузки
   ```

3. Обновления:

   ```bash
   git pull
   npm i --omit=dev
   pm2 restart dont-do-like-that-bot
   ```

> Можно хранить окружение в `.env` (подхватывается автоматически) или в `pm2 start --env`/ecosystem.config.js.

### Вариант B — **systemd** (нативный сервис Linux)

1. Скопируйте код бота в `/opt/dont-do-like-that/bot`.
2. Создайте `/etc/systemd/system/dont-do-like-that-bot.service` со следующим содержимым:

   ```ini

   ```

[Unit]
Description=Telegram Bot (dont-do-like-that)
After=network.target

[Service]
WorkingDirectory=/opt/dont-do-like-that/bot
Environment=BOT_TOKEN=123456:ABC...
Environment=WEBAPP_URL=https://<user>.github.io/dont-do-like-that/
ExecStart=/usr/bin/node bot.js
Restart=always
RestartSec=5
User=botuser
Group=botuser

[Install]
WantedBy=multi-user.target

````

3. Примените и запустите:
```bash
sudo systemctl daemon-reload
sudo systemctl enable --now dont-do-like-that-bot
sudo systemctl status dont-do-like-that-bot
````

4. Логи:

   ```bash
   journalctl -u dont-do-like-that-bot -f
   ```

### Вариант C — **Docker**

1. Соберите образ:

   ```bash
   docker build -t dont-do-like-that-bot ./bot
   ```

2. Запустите контейнер:

   ```bash
   docker run -d --name dont-do-like-that-bot --restart always \

   -e BOT_TOKEN=123456:ABC... \
   -e WEBAPP_URL=https://<user>.github.io/dont-do-like-that/ \
   dont-do-like-that-bot

   ```

---

## Полезные нюансы

- Mini App открывается **только по HTTPS**.
- Имя пользователя (`initDataUnsafe.user`) приходит **только внутри Telegram‑клиента**.
- Если Mini App нужно открыть как обычную страницу вне Telegram — всё работает, но без `initDataUnsafe`.
- Для продакшн‑логики добавьте обмен данными WebApp → бот через `web_app_data` или ваш API.

---

## Лицензия

MIT
