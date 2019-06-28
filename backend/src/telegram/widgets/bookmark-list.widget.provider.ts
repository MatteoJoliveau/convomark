// @ts-ignore
import {Widget} from 'telegraf-widget';
import {Provider} from "@loopback/context";
import {repository} from "@loopback/repository";
import {CollectionRepository} from "../../repositories";
import {ContextMessageUpdate, Markup} from "telegraf";
import {ExtraEditMessage} from "telegraf/typings/telegram-types";
import {Loggable, Logger, logger} from "../../logging";
import {Bookmark} from '../../models';
import {get} from 'lodash';
import {I18nContext} from "../types";
import * as Sentry from "@sentry/node";

const LIMIT = 5;

@logger()
export class BookmarkListWidgetProvider implements Provider<Widget>, Loggable {
    logger: Logger;

    constructor(
        @repository(CollectionRepository) private collectionRepository: CollectionRepository,
    ) {
    }

    value(): Widget {
        const widget = new Widget('bookmarks', 'list');

        widget.on('list', async (ctx: ContextMessageUpdate) => {
            try {
                const {query: {shortId, off}} = get(ctx, 'widget.data');
                const offset = this.decodeOffset(off);
                const collection = await this.collectionRepository.findOne({
                    where: {shortId},
                });
                if (!collection) {
                    return ctx.replyWithHTML(ctx.i18n.t('errors.entityNotFound', {entity: ctx.i18n.t('collections.one')}))
                }
                const total = (await this.collectionRepository.bookmarkCollections(collection.id).find()).length;
                const bookmarks = await this.collectionRepository.bookmarks({where: {shortId}})({limit: LIMIT, offset});
                const extra = this.generateKeyboard(ctx.i18n, widget, total, offset, shortId);
                return this.sendReply(ctx, collection.title, bookmarks, extra, off);
            } catch (e) {
                this.logger.error(e);
                const eventId = Sentry.captureException(e);
                await ctx.replyWithHTML(ctx.i18n.t('errors.sentry', {eventId}));
            }
        });

        return widget;
    }

    private decodeOffset(offset: string | undefined): number {
        if (!offset) return 0;
        const decoded = new Buffer(offset, 'base64').toString('utf-8');
        return parseInt(decoded) || 0;
    }

    private encodeOffset(offset: number): string {
        return new Buffer(offset.toString()).toString('base64');
    }

    private sendReply(ctx: ContextMessageUpdate, collectionName: string, boookmarks: Bookmark[], extra: ExtraEditMessage | undefined, offset: string | undefined) {
        const header = ctx.i18n.t('bookmarks.many');
        const bookmarkList = boookmarks.reduce((text, {name, messageLink}) => {
            const nameLink = name && `<a href="${messageLink}">${name}</a>`;
            return `${text}${nameLink || messageLink}\n\n`;
        }, '');
        const message = `
<b>${header} in ${collectionName}</b>

${bookmarkList}
        `;
        const params = {...extra, disable_web_page_preview: true };
        offset ? ctx.editMessageText(message, {...params, parse_mode: 'HTML'}) : ctx.replyWithHTML(message, params);
    }

    private generateKeyboard(i18n: I18nContext, widget: Widget, bookmarksCount: number, offset: number, id: string): ExtraEditMessage | undefined {
        if (bookmarksCount <= LIMIT) return;
        const buttons = [];
        if (offset > 0) {
            const off = this.encodeOffset(offset - 1);
            buttons.push(widget.button(i18n.t('backward'), 'list', {id, off}))
        }

        const off = this.encodeOffset(offset + 1);
        const button = widget.button(i18n.t('forward'), 'list', {id, off});
        buttons.push(button);
        return (Markup.inlineKeyboard(buttons) as any).extra()
    }
}