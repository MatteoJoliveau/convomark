import Telegraf, { ContextMessageUpdate } from "telegraf";
import { Bookmark } from "../entity/Bookmark";
import { Collection } from "../entity/Collection";
import { getLogger } from "../logger";
import { BookmarkService } from "../service/bookmark.service";
import { CollectionService } from "../service/collection.service";
import { UserService } from "../service/user.service";
const { FRONTEND_DOMAIN } = process.env;

export function withCommands(bot: Telegraf<ContextMessageUpdate>, userService: UserService, bookmarkService: BookmarkService, collectionService: CollectionService): Telegraf<ContextMessageUpdate> {
    const logger = getLogger("bot");
    bot.start(async (ctx) => {
        const from = (ctx.from!);
        logger.info("Received start command from user", { user: from });
        const user = await userService.getOrCreateUser(from);
        ctx.replyWithHTML(`Welcome ${user.firstName}!
Please run the /help command to get some useful informations about how I work!
Also remeber to check out your <a href="${FRONTEND_DOMAIN}">personal dashboard</a>, where you can
manage all your bookmarks and collections!

<b>WARNING</b>
This bot is experimental and still under heavy development. Expect bugs, crashes and uninplemented features.
Please report any problem to @GamesCodex
        `);
    });

    bot.help((ctx) => {
        ctx.replyWithHTML(`<b>ConvoMarkBot Help</b>
Available commands:

    /save &lt;message link&gt; [&lt;collection title&gt; (optional, default='Default')]
        Bookmarks a message in the specified collection

    /get [&lt;collection title&gt; (optional, default='Default')]
        Lists all the saved bookmarks in the specified collection

    /createcollection &lt;collection title&gt;
        Creates a new collection with the given title

    /deletecollection &lt;collection title&gt;
        Deletes the collection with the given title

Remember to check out your <a href="${FRONTEND_DOMAIN}">personal dashboard</a>!
        `);
    });

    bot.command("save", async (ctx) => {
        try {
            const from = (ctx.from!);
            const userOpt = await userService.getUser({ id: from.id });
            const user = userOpt.get();
            const message = (ctx.message!);
            const text = (message.text!);
            const entity = message.entities!.find((entity) => entity.type === "url")!;
            if (entity) {
                const entityEnd = (entity.offset + entity.length);
                const messageLink = text.substring(entity.offset, entityEnd);
                const title = text.substring(entityEnd).trim() || "default";
                const optional = await collectionService.getCollectionByTitle({ title, user });
                optional.ifPresentOrElse(
                    async (collection) => {
                        const bookmark = (await collection.bookmarks).find((mark) => mark.messageLink === messageLink);
                        if (bookmark) {
                            ctx.reply("You already saved this message in this collection");
                        } else {
                            const bookmark = new Bookmark();
                            bookmark.messageLink = messageLink;
                            bookmark.user = user;
                            bookmark.collections = Promise.resolve([collection]);
                            await bookmarkService.save(bookmark);
                            ctx.reply(`Thanks! I have saved your message in collection ${collection.title}`);
                        }
                    },
                    () => {
                        ctx.reply(`Sorry! I couldn't find a collection named ${title}`);
                    },
                );
            } else {
                ctx.reply(`Please provide a message link to bookmark`);
            }
        } catch (e) {
            ctx.reply(`Uh oh, there was an error: ${e}`);
        }
    });

    bot.command("get", async (ctx) => {
        const from = (ctx.from!);
        const message = (ctx.message!);
        const text = (message.text!);
        const entity = message.entities!.find((entity) => entity.type === "bot_command")!;
        const entityEnd = (entity.offset + entity.length);
        const title = text.substring(entityEnd).trim() || "default";
        const user = (await userService.getUser({ id: from.id })).get();
        const optional = await collectionService.getCollectionByTitle({ user, title });
        optional.ifPresentOrElse(
            async (collection) => {
                const bookmarks = await collection.bookmarks;
                const links = bookmarks.map((mark) => mark.messageLink).join("\n");
                logger.debug("Found bookmarks in collection", { bookmarks, collection });
                ctx.replyWithHTML(`
Collection <b>${collection.title}</b>
Links:
${links || "<i>None</i>"}
                `);
            },
            () => {
                ctx.reply(`Sorry! I couldn't find a collection named ${title}`);
            },
        );
    });

    bot.command("createcollection", async (ctx) => {
        const from = (ctx.from!);
        const message = (ctx.message!);
        const text = (message.text!);
        const entity = message.entities!.find((entity) => entity.type === "bot_command")!;
        const entityEnd = (entity.offset + entity.length);
        const title = text.substring(entityEnd).trim();
        if (title) {
            const user = (await userService.getUser({ id: from.id })).get();
            const optional = await collectionService.getCollectionByTitle({ user, title });
            optional.ifPresentOrElse(
                () => {
                    ctx.reply(`Sorry! You already have a collection named ${title}`);
                },
                async () => {
                    const collection = new Collection();
                    collection.title = title;
                    collection.user = user;
                    const created = await collectionService.save(collection);
                    ctx.replyWithHTML(`Thank you, your collection named ${title} has been created!
    Try it by sending <code>/get ${title}</code>           
                    `);
                },
            );
        } else {
            ctx.reply(`Please provide a collection title to create`);
        }
    });

    bot.command("deletecollection", async (ctx) => {
        const from = (ctx.from!);
        const message = (ctx.message!);
        const text = (message.text!);
        const entity = message.entities!.find((entity) => entity.type === "bot_command")!;
        const entityEnd = (entity.offset + entity.length);
        const title = text.substring(entityEnd).trim();
        if (title) {
            const user = (await userService.getUser({ id: from.id })).get();
            const optional = await collectionService.getCollectionByTitle({ user, title });
            optional.ifPresentOrElse(
                async (collection) => {
                    const deleted = await collectionService.delete(collection);
                    ctx.replyWithHTML(`Thank you, your collection named ${deleted.title} has been deleted!`);
                },
                () => {
                    ctx.reply(`Sorry! I couldn't find a collection named ${title}`);

                },
            );
        } else {
            ctx.reply(`Please provide a valid collection title to delete`);
        }
    });

    return bot;
}