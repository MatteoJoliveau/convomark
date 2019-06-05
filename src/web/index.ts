import fastify from 'fastify';
import bot, { BOT_TOKEN } from '../bot';
import isProduction from '../utils/isProduction';

const { WEB_DOMAIN } = process.env;
const botCallbackPath = `/bot/${BOT_TOKEN}`;


const app = fastify();

if (isProduction) {
    app.use(bot.webhookCallback(botCallbackPath));
    bot.telegram.setWebhook(`${WEB_DOMAIN}${botCallbackPath}`);
} else {
    bot.launch();
}


export default app;