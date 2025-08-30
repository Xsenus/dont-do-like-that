import { Telegraf, Markup } from 'telegraf';
import 'dotenv/config';

const { BOT_TOKEN, WEBAPP_URL } = process.env;
if (!BOT_TOKEN || !WEBAPP_URL) {
  console.error('Set BOT_TOKEN and WEBAPP_URL in .env');
  process.exit(1);
}

const bot = new Telegraf(BOT_TOKEN);

// Клавиатура с webApp-кнопкой
bot.start((ctx) => {
  return ctx.reply(
    'Открой мини‑приложение:',
    Markup.keyboard([[Markup.button.webApp('Открыть', WEBAPP_URL)]]).resize(),
  );
});

// Инлайн‑кнопка (альтернатива)
bot.command('app', (ctx) => {
  return ctx.reply(
    'Запуск мини‑приложения:',
    Markup.inlineKeyboard([Markup.button.webApp('Открыть', WEBAPP_URL)]),
  );
});

// Хэндлер для возможных данных от WebApp (когда добавите форму)
bot.on('message', (ctx) => {
  const data = ctx.message?.web_app_data?.data;
  if (data) {
    console.log('Received from WebApp:', data);
  }
});

bot.launch().then(() => console.log('Bot is up. Send /start to see the WebApp button.'));

// Чистое завершение
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
