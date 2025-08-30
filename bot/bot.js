import { Telegraf, Markup } from 'telegraf';
import 'dotenv/config';

const { BOT_TOKEN, WEBAPP_URL } = process.env;
if (!BOT_TOKEN || !WEBAPP_URL) {
  console.error('❌ Set BOT_TOKEN and WEBAPP_URL in .env');
  process.exit(1);
}

const bot = new Telegraf(BOT_TOKEN);

const lastSeen = new Map();
const THROTTLE_MS = 800;

bot.use(async (ctx, next) => {
  const userId = ctx.from?.id;
  const now = Date.now();
  const last = userId ? lastSeen.get(userId) || 0 : 0;
  if (userId && now - last < THROTTLE_MS) return;
  if (userId) lastSeen.set(userId, now);

  console.log(
    `[${new Date().toISOString()}] ${ctx.from?.username || ctx.from?.id} -> ${ctx.updateType}`,
  );
  return next();
});

const mainKeyboard = Markup.keyboard([
  [Markup.button.webApp('🚀 Открыть приложение', WEBAPP_URL)],
]).resize();

const mainInline = Markup.inlineKeyboard([
  [Markup.button.webApp('🚀 Открыть', WEBAPP_URL)],
  [Markup.button.url('💬 Написать @Xsenus', 'https://t.me/Xsenus')],
]);

bot.start(async (ctx) => {
  const name =
    ctx.from?.first_name?.trim() || (ctx.from?.username ? `@${ctx.from.username}` : 'друг');

  const text =
    `Привет, ${name}!` +
    `\nЭто мини-приложение «Не надо так делать».` +
    `\n\nНажмите «Открыть приложение», чтобы запустить TMA внутри Telegram.`;

  await ctx.reply(text, {
    reply_markup: mainKeyboard.reply_markup,
  });

  await ctx.reply('Или используйте кнопки ниже:', {
    reply_markup: mainInline.reply_markup,
    disable_web_page_preview: true,
  });
});

bot.command('app', async (ctx) => {
  await ctx.reply('Запуск мини-приложения:', {
    reply_markup: mainInline.reply_markup,
    disable_web_page_preview: true,
  });
});

bot.command('help', async (ctx) => {
  await ctx.reply(
    [
      '❓ Справка',
      '— /start — показать кнопки запуска',
      '— /app — инлайн-кнопка открытия приложения',
      '— /ping — проверка доступности бота',
      '',
      'Мини-приложение открывается по кнопке WebApp и подстраивается под тему Telegram.',
    ].join('\n'),
  );
});

bot.command('ping', async (ctx) => {
  const t = Date.now();
  const m = await ctx.reply('pong…');
  const dt = Date.now() - t;
  try {
    await ctx.telegram.editMessageText(m.chat.id, m.message_id, undefined, `pong (${dt} ms)`);
  } catch {
    /* ignore */
  }
});

bot.on('message', async (ctx) => {
  const data = ctx.message?.web_app_data?.data;
  if (!data) return;

  try {
    let view = data;
    try {
      const parsed = JSON.parse(data);
      view = '```json\n' + JSON.stringify(parsed, null, 2) + '\n```';
    } catch {}

    await ctx.replyWithMarkdownV2(`✅ Данные получены из WebApp:\n${view}`, {
      disable_web_page_preview: true,
    });
  } catch (e) {
    console.error('WebApp data error:', e);
    await ctx.reply('❌ Ошибка обработки данных из WebApp.');
  }
});

bot.catch((err, ctx) => {
  console.error(`Bot error for ${ctx.updateType}:`, err);
});

bot.launch().then(() => {
  console.log('✅ Bot is up. Send /start to see the WebApp button.');
});

process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
