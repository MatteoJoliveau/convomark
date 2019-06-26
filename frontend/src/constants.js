const BOT_NAME = process.env.VUE_APP_TELEGRAM_BOT_NAME;
const BOT_LINK = `https://telegram.me/${BOT_NAME}?start`;
const API_ENDPOINT = process.env.VUE_APP_API_ENDPOINT || 'http://localhost:3000';
const MATOMO_URL = `${process.env.VUE_APP_MATOMO_HOST}/index.php?module=CoreHome&action=index&idSite=1&period=day&date=yesterday#?idSite=1&period=day&date=yesterday&category=Dashboard_Dashboard&subcategory=1`;

export { BOT_NAME, BOT_LINK, API_ENDPOINT, MATOMO_URL };
