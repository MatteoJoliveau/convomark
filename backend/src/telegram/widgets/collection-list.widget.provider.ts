// @ts-ignore
import TelegrafWidget, {Widget} from 'telegraf-widget';
import {inject, Provider} from '@loopback/context';
import {CollectionRepository, TypeORMBindings} from '../../typeorm';
import {ContextMessageUpdate, Markup} from 'telegraf';
import {ExtraEditMessage} from 'telegraf/typings/telegram-types';
import {Loggable, Logger, logger} from '../../logging';

const {sendWidget} = TelegrafWidget;

@logger()
export class CollectionListWidgetProvider
  implements Provider<Widget>, Loggable {
  logger: Logger;

  constructor(
    @inject(TypeORMBindings.COLLECTION_REPOSITORY)
    private collectionRepository: CollectionRepository,
  ) {}

  value(): Widget {
    const widget = new Widget('collections', 'list-bookmarks');

    widget.on('list-bookmarks', async (ctx: ContextMessageUpdate) => {
      const {currentUser} = ctx.state;
      this.logger.debug({currentUser}, 'Listing user collections');
      const collections = await currentUser.collections;
      const buttons = collections.map(({shortId, title}) =>
        widget.button(title, 'bookmarks', {id: shortId}),
      );
      this.logger.debug({buttons}, 'Building collection buttons');
      // @ts-ignore
      const extra = Markup.inlineKeyboard(buttons, {columns: 3}).extra();
      const message = ctx.i18n.t('collections.list.header');
      return CollectionListWidgetProvider.listReply(ctx, message, extra);
    });

    widget.on('bookmarks', sendWidget('bookmarks'));

    return widget;
  }

  private static listReply(
    ctx: ContextMessageUpdate,
    message: string,
    extra: ExtraEditMessage,
  ) {
    return ctx.replyWithHTML(message, extra);
  }
}
