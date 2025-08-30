# docker build -t dont-do-like-that-bot .
# docker run -d --name dont-do-like-that-bot --restart always \
#   -e BOT_TOKEN=123456:ABC... \
#   -e WEBAPP_URL=https://<user>.github.io/dont-do-like-that/ \
#   dont-do-like-that-bot
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --omit=dev
COPY . .
ENV NODE_ENV=production
CMD ["node", "bot.js"]
