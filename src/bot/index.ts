import { getLogger } from "../logger";
import { Telegraf, ContextMessageUpdate } from 'telegraf';
import { User as TelegramUser, Message } from "telegram-typings";
import {Optional} from 'typescript-optional';
import { withCommands } from "./commands";

const Bot = require('telegraf');
const logger = getLogger('bot');

const { TELEGRAM_BOT_TOKEN } = process.env;

export const BOT_TOKEN = TELEGRAM_BOT_TOKEN || 'token';

let bot: Telegraf<ContextMessageUpdate> = new Bot(BOT_TOKEN);

bot.catch(logger.error);

bot = withCommands(bot);

export default bot;