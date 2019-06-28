// @ts-ignore
import TelegrafWidget, {Widget} from 'telegraf-widget';
import {Provider} from "@loopback/context";
import {repository} from "@loopback/repository";
import {CollectionRepository} from "../../repositories";
import {ContextMessageUpdate, Markup} from "telegraf";
import {ExtraEditMessage} from "telegraf/typings/telegram-types";
import {logger, Logger, Loggable} from "../../logging";

const {sendWidget} = TelegrafWidget;

@logger()
export class CollectionListWidgetProvider implements Provider<Widget>, Loggable {
    logger: Logger;

    constructor(
        @repository(CollectionRepository) private collectionRepository: CollectionRepository,
    ) {}

    value(): Widget {
        const widget = new Widget('collections', 'list');

        widget.on('list', async (ctx: ContextMessageUpdate) => {
            const userId = ctx.from!.id;
            const collections = await this.collectionRepository.find({ where: { userId }});
            const buttons = collections.map(({shortId, title}) => (widget.button(title, 'bookmarks', {id: shortId})));
            // @ts-ignore
            const extra = Markup.inlineKeyboard(buttons, {columns: 3}).extra();
            return CollectionListWidgetProvider.listReply(ctx, extra);
        });

        widget.on('bookmarks', sendWidget('bookmarks'));

        return widget;
    }

    private static listReply(ctx: ContextMessageUpdate, extra: ExtraEditMessage) {
        const message = ctx.i18n.t('collections.list.header');
        // ctx.widget.data ? ctx.editMessageText(message, extra) : ctx.replyWithHTML(message, extra);
        return ctx.replyWithHTML(message, extra);
    }
}