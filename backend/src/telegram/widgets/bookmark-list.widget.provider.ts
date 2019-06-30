/* eslint-disable @typescript-eslint/camelcase */
// @ts-ignore
import {Widget} from 'telegraf-widget';
import {inject, Provider} from '@loopback/context';
import {get} from 'lodash';
import {
  CollectionRepository,
  BookmarkRepository,
  TypeORMBindings,
} from '../../typeorm';
import {ContextMessageUpdate, Markup} from 'telegraf';
import {ExtraEditMessage} from 'telegraf/typings/telegram-types';
import {Loggable, Logger, logger} from '../../logging';
import {Bookmark} from '../../models';

const LIMIT = 5;

@logger()
export class BookmarkListWidgetProvider implements Provider<Widget>, Loggable {
  logger: Logger;

  constructor(
    @inject(TypeORMBindings.COLLECTION_REPOSITORY)
    private collectionRepository: CollectionRepository,
    @inject(TypeORMBindings.BOOKMARK_REPOSITORY)
    private bookmarkRepository: BookmarkRepository,
  ) {}

  value(): Widget {
    const widget = new Widget('bookmarks', 'list');

    widget.on('list', async (ctx: ContextMessageUpdate) => {
      this.logger.info('Fetching bookmarks in collection');
      await ctx.answerCbQuery();
      const {
        query: {id, off},
      } = get(ctx, 'widget.data');
      const offset = this.decodeOffset(off);
      const collection = await this.collectionRepository.findOne({
        where: {shortId: id},
      });
      if (!collection) {
        this.logger.warn('Collection not found by %s', id);
        return ctx.replyWithHTML(
          ctx.i18n.t('errors.entityNotFound', {
            entity: ctx.i18n.t('collections.one'),
          }),
        );
      }
      this.logger.debug({collection}, 'Found collection');
      const [bookmarks, total] = await this.bookmarkRepository.findAndCount({
        where: {collection},
        take: LIMIT,
        skip: offset,
      });
      this.logger.debug('Paginating %d bookmarks', total);
      const extra = this.generateKeyboard(widget, {
        total,
        offset,
        collectionId: id,
        ctx,
      });
      return this.sendReply(ctx, collection.title, bookmarks, extra, off);
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

  private sendReply(
    ctx: ContextMessageUpdate,
    collectionName: string,
    boookmarks: Bookmark[],
    extra: ExtraEditMessage | undefined,
    offset: string | undefined,
  ) {
    const header = ctx.i18n.t('bookmarks.many');
    const bookmarkList = boookmarks.reduce((text, {name, messageLink}) => {
      const link = name ? `<a href="${messageLink}">${name}</a>` : messageLink;
      return `${text}${link}\n\n`;
    }, '');
    const message = `
<b>${header} in ${collectionName}</b>

${bookmarkList}
        `;
    const params = {...extra, disable_web_page_preview: true};
    return offset
      ? ctx.editMessageText(message, {...params, parse_mode: 'HTML'})
      : ctx.replyWithHTML(message, params);
  }

  private generateKeyboard(
    widget: Widget,
    {total, offset, collectionId: id, ctx: {i18n}}: KeyboardGenerationParams,
  ) {
    this.logger.debug(
      {offset, limit: LIMIT, total},
      'Generating keyboard for %d bookmarks out of %d',
      LIMIT,
      total,
    );
    if (total <= LIMIT) return;
    const buttons = [];
    if (offset > 0) {
      this.logger.debug('Building backward button');
      const off = this.encodeOffset(offset - LIMIT);
      buttons.push(widget.button(i18n.t('backward'), 'list', {id, off}));
    }

    if (offset + LIMIT < total) {
      this.logger.debug('Building forward button');
      const off = this.encodeOffset(offset + LIMIT);
      buttons.push(widget.button(i18n.t('forward'), 'list', {id, off}));
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return (Markup.inlineKeyboard(buttons) as any).extra();
  }
}

interface KeyboardGenerationParams {
  total: number;
  offset: number;
  collectionId: number;
  ctx: ContextMessageUpdate;
}
