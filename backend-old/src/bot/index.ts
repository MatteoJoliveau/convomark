import { ContextMessageUpdate, Telegraf } from "telegraf";
import { getLogger } from "../logger";
import { BookmarkService } from "../service/bookmark.service";
import { CollectionService } from "../service/collection.service";
import { UserService } from "../service/user.service";
import { withCommands } from "./commands";

const Bot = require("telegraf");

const { TELEGRAM_BOT_TOKEN } = process.env;

export const BOT_TOKEN = TELEGRAM_BOT_TOKEN || "token";

export async function createBot(userService: UserService, bookmarkService: BookmarkService, collectionService: CollectionService): Promise<Telegraf<ContextMessageUpdate>> {
    const logger = getLogger("bot");
    let bot: Telegraf<ContextMessageUpdate> = new Bot(BOT_TOKEN);

    bot.catch(logger.error.bind(logger));

    bot = withCommands(bot, userService, bookmarkService, collectionService);

    return bot;
}