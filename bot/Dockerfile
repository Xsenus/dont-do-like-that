FROM cgr.dev/chainguard/node:20
WORKDIR /app
COPY package*.json ./
RUN npm ci --omit=dev
COPY . .
ENV NODE_ENV=production
USER 10001
CMD ["node", "bot.js"]
