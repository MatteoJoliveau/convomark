/// <reference path="../../../telegraf.d.ts" />
import WizardScene from 'telegraf/scenes/wizard';
import {Markup} from 'telegraf';
import {inject, Provider} from '@loopback/context';
import {Loggable, logger, Logger} from '../../../../logging';
import {
  BookmarkRepository,
  CollectionRepository,
  TypeORMBindings,
  UserRepository,
} from '../../../../typeorm';
import {Bookmark, Collection} from '../../../../models';
import {validateTelegramLink} from '../../../../validators';

@logger()
export class SaveBookmarksSceneProvider
  implements Provider<WizardScene>, Loggable {
  logger: Logger;

  constructor(
    @inject(TypeORMBindings.USER_REPOSITORY)
    private userRepository: UserRepository,
    @inject(TypeORMBindings.COLLECTION_REPOSITORY)
    private collectionRepository: CollectionRepository,
    @inject(TypeORMBindings.BOOKMARK_REPOSITORY)
    private bookmarkRepository: BookmarkRepository,
  ) {}

  value(): WizardScene {
    return new WizardScene(
      'save-bookmark',
      async ctx => {
        const {currentUser} = ctx.state;
        this.logger.info({currentUser}, 'Saving new bookmark');
        const {entities, text} = ctx.message!;
        if (!entities) {
          this.logger.error({telegramMessage: ctx.message}, 'No entities!');
          return ctx.scene.leave();
        }
        const entity = entities.find(e => e.type === 'url')!;
        const link = text!.substring(
          entity.offset,
          entity.offset + entity.length,
        );
        try {
          validateTelegramLink(link);
        } catch (e) {
          this.logger.warn(
            {
              user: ctx.from!.id,
              message: ctx.message,
            },
            e.message,
          );
          ctx
            .reply(ctx.i18n.t('validations.telegramLink', {link}))
            .catch(this.logger.error.bind(this.logger));
          ctx.session = null;
          return ctx.scene.leave();
        }
        ctx.session.messageLink = link;
        const collections = await currentUser.collections;
        ctx.session.collections = collections;
        const buttons = collections.map(({title, slug}) =>
          Markup.callbackButton(title, slug),
        );

        await ctx.reply(
          ctx.i18n.t('bookmarks.save.step1'),
          Markup.inlineKeyboard([
            ...buttons,
            Markup.callbackButton(ctx.i18n.t('cancel'), 'cancel'),
            // @ts-ignore
          ]).extra(),
        );
        return ctx.wizard.next();
      },
      async ctx => {
        if (!ctx.callbackQuery) {
          await ctx.reply('Nope');
          return ctx.wizard.back();
        }
        this.logger.debug('Asking about bookmark title');
        const slug = ctx.callbackQuery.data;
        if (slug === 'cancel') {
          await ctx.reply(ctx.i18n.t('bye'));
          ctx.session = {};
          return ctx.scene.leave();
        }
        await ctx.answerCbQuery();
        const collection = (ctx.session.collections || []).find(
          (c: Collection) => c.slug === slug,
        );
        if (!collection) {
          await ctx.reply(
            ctx.i18n.t('errors.entityNotFound', {entity: 'Collection'}),
          );
          return ctx.scene.leave();
        }
        delete ctx.session.collections;
        ctx.session.collectionId = collection.id;
        await ctx.reply(
          ctx.i18n.t('bookmarks.save.step2.question', {
            collection: collection.title,
          }),
          Markup.inlineKeyboard([
            Markup.callbackButton(ctx.i18n.t('yes'), 'yes'),
            Markup.callbackButton(ctx.i18n.t('no'), 'no'),
            // @ts-ignore
          ]).extra(),
        );
        return ctx.wizard.next();
      },
      async ctx => {
        if (!ctx.callbackQuery) {
          await ctx.reply('Nope');
          return ctx.wizard.back();
        }
        this.logger.debug('Fetching collection to save bookmark in');
        const {currentUser} = ctx.state;
        const collectionId = ctx.session.collectionId;
        const collection = await this.collectionRepository.findOneOrFail(
          collectionId,
        );
        this.logger.debug({collection}, 'Found collection');
        const bookmark = await this.bookmarkRepository.save(
          new Bookmark({
            user: currentUser,
            messageLink: ctx.session.messageLink,
            collection,
          }),
        );
        this.logger.debug({bookmark}, 'Saved bookmark');

        await ctx.answerCbQuery();
        this.logger.debug('Add Bookmark title: %s', ctx.callbackQuery.data);
        if (ctx.callbackQuery.data === 'yes') {
          ctx.session.bookmark = bookmark;
          await ctx.reply(ctx.i18n.t('bookmarks.save.step3.yes'));
          return ctx.wizard.next();
        }

        await ctx.reply(ctx.i18n.t('bookmarks.save.step3.no'));
        ctx.session = null;
        return ctx.scene.leave();
      },
      async ctx => {
        const name = ctx.message!.text;
        const bookmark = await this.bookmarkRepository.save(
          new Bookmark({...ctx.session.bookmark, name}),
        );
        this.logger.debug({bookmark}, 'Finalized bookmark');

        await ctx.reply(
          ctx.i18n.t('bookmarks.save.conclusion', {bookmark: name}),
        );
        ctx.session = null;
        return ctx.scene.leave();
      },
    );
  }
}
