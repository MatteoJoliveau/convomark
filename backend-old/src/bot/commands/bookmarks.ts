import { ContextMessageUpdate } from "telegraf";
import { extractEntity, messageText } from "./commons";
import { Logger } from "'../logging'";

export function onBookmarkUrl(logger: Logger): (ctx: ContextMessageUpdate) => void {
    return (ctx) => {
        const text = messageText(ctx);
        const entity = ctx.message!.entities![0];
        const url = extractEntity(text, entity);
        logger.info('Got url', url);
        ctx.reply(`Got url: ${url}`);
    }
}