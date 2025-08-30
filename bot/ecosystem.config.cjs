module.exports = {
  apps: [
    {
      name: "dont-do-like-that-bot",
      script: "bot.js",
      env: {
        NODE_ENV: "production",
        WEBAPP_URL: "https://<user>.github.io/dont-do-like-that/"
      },
      env_production: {
        NODE_ENV: "production"
      }
    }
  ]
};
