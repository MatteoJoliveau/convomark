import Telegraf, { ContextMessageUpdate } from "telegraf";
import { getLogger } from "../logger";
import { Optional } from "typescript-optional";
import { User as TelegramUser } from "telegram-typings";
import { getUserService } from "../service/user.service";
import { getRepository } from "typeorm";
import { User } from "../entity/User";

const logger = getLogger('bot');
const userService = getUserService();

export function withCommands(bot: Telegraf<ContextMessageUpdate>): Telegraf<ContextMessageUpdate> {
    bot.command('start', (ctx) => {
        Optional.ofNullable(ctx.from).ifPresent(async (user: TelegramUser) => {
            const updatedUser = await userService.save(user);
            ctx.reply(`Welcome ${updatedUser.first_name}!`);
        })
    });

    bot.command('get', async (ctx) => {
        const repo = getRepository(User);
        const users = await repo.find();
        const names = users.map((user) => user.firstName);
        ctx.reply(names.join(' | '));
    });

    bot.command('save', (ctx) => {
        const message = (ctx.message!);
        const body = (message.text!);
        const entity = message.entities!.find((entity) => entity.type === 'url');
        const url = body.substring(entity!.offset, (entity!.offset + entity!.length));
        logger.info('Save CMD', url);
    });

    return bot;
}