import Telegraf, { ContextMessageUpdate } from "telegraf";
import { getLogger } from "../logger";
import { Optional } from "typescript-optional";
import { User as TelegramUser } from "telegram-typings";
import { getRepository } from "typeorm";
import { User } from "../entity/User";
import { UserService } from "../service/user.service";
import { MessageService } from "../service/message.service";
import { mapMessageToLink } from "../mapper/message.mapper";


export function withCommands(bot: Telegraf<ContextMessageUpdate>, userService: UserService, messageService: MessageService): Telegraf<ContextMessageUpdate> {
    const logger = getLogger('bot');
    bot.command('start', (ctx) => {
        Optional.ofNullable(ctx.from).ifPresent(async (user: TelegramUser) => {
            const updatedUser = await userService.save(user);
            ctx.reply(`Welcome ${updatedUser.first_name}!`);
        })
    });

    bot.command('save', (ctx) => {
        const telegramMessage = (ctx.message!);
        const body = (telegramMessage.text!);
        const entity = telegramMessage.entities!.find((entity) => entity.type === 'url');
        const url = body.substring(entity!.offset, (entity!.offset + entity!.length));
        messageService.getMessageFromLink(url)
            .then((message) => {
                ctx.reply('Thanks! I have saved your message')
            })
            .catch((error) => {
                ctx.reply(`Uh oh, there was an error: ${error}`)
            });
    });

    bot.command('get', async (ctx) => {
        const messages = await messageService.getAllMessages();
        const links = messages.map(mapMessageToLink).join("\n");
        ctx.reply(links);
    });

    return bot;
}