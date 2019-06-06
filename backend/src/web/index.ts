import fastify, { FastifyInstance } from 'fastify';
import { BOT_TOKEN } from '../bot';
import isProduction from '../utils/isProduction';
import { Telegraf, ContextMessageUpdate } from 'telegraf';

const { WEB_DOMAIN } = process.env;
const botCallbackPath = `/bot/${BOT_TOKEN}`;


export async function createFastifyInstance(bot: Telegraf<ContextMessageUpdate>): Promise<FastifyInstance> {
    const app = fastify();

    if (isProduction) {
        app.use(bot.webhookCallback(botCallbackPath));
        bot.telegram.setWebhook(`${WEB_DOMAIN}${botCallbackPath}`);
    } else {
        bot.launch();
    }
    
    return app;
}
