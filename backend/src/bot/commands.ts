import Telegraf, { ContextMessageUpdate } from "telegraf";
import { getLogger } from "../logger";
import { Optional } from "typescript-optional";
import { User as TelegramUser } from "telegram-typings";
import { User } from "../entity/User";
import { Bookmark } from "../entity/Bookmark";
import { UserService } from "../backend/service/user.service";
import { BookmarkService } from "../backend/service/bookmark.service";


export function withCommands(bot: Telegraf<ContextMessageUpdate>, userService: UserService, bookmarkService: BookmarkService): Telegraf<ContextMessageUpdate> {
    const logger = getLogger('bot');
    bot.command('start', (ctx) => {
        Optional.ofNullable(ctx.from).ifPresent(async (user: TelegramUser) => {
            const updatedUser = await userService.save(user);
            ctx.reply(`Welcome ${updatedUser.firstName}!`);
        })
    });

    bot.command('save', async (ctx) => {
        try {
        const from = (ctx.from!);
        const user = await userService.getUser(from.id)
        const telegramMessage = (ctx.message!);
        const body = (telegramMessage.text!);
        const entity = telegramMessage.entities!.find((entity) => entity.type === 'url');
        const messageLink = body.substring(entity!.offset, (entity!.offset + entity!.length));
        const bookmarkOpt = await bookmarkService.getBookmark({ messageLink })
        bookmarkOpt.ifPresentOrElse((bookmark) => {
            ctx.reply('You already saved this message');
        }, async () => {
            const bookmark = new Bookmark();
            bookmark.messageLink = messageLink;
            bookmark.user = user.get();
            await bookmarkService.save(bookmark);
            ctx.reply('Thanks! I have saved your message');
        });
                
        } catch (e) {
            ctx.reply(`Uh oh, there was an error: ${e}`)
        }
    });

    bot.command('get', async (ctx) => {
        const bookmarks = await bookmarkService.getBookmarks();
        const links = bookmarks.map((mark) => mark.messageLink).join("\n");
        ctx.reply(links);
    });

    return bot;
}