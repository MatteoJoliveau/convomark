/// <reference path="../../../telegraf.d.ts" />
import WizardScene from 'telegraf/scenes/wizard';
// @ts-ignore
import {inject, Provider} from '@loopback/context';
import {Loggable, logger, Logger} from '../../../../logging';
import {CollectionRepository, TypeORMBindings} from '../../../../typeorm';
import {Markup} from 'telegraf';

@logger()
export class RenameCollectionSceneProvider
  implements Provider<WizardScene>, Loggable {
  logger: Logger;

  constructor(
    @inject(TypeORMBindings.COLLECTION_REPOSITORY)
    private collectionRepository: CollectionRepository,
  ) {}

  value(): WizardScene {
    return new WizardScene(
      'rename-collection',
      async ctx => {
        const {currentUser} = ctx.state;
        this.logger.debug({currentUser}, 'Renaming user collection');
        const collections = await currentUser.collections;
        const buttons = collections.map(({shortId, title}) =>
          Markup.callbackButton(title, shortId),
        );
        this.logger.debug({buttons}, 'Building collection buttons');
        // @ts-ignore
        const extra = Markup.inlineKeyboard(buttons, {columns: 3}).extra();
        const message = ctx.i18n.t('collections.rename.list');
        await ctx.replyWithHTML(message, extra);
        return ctx.wizard.next();
      },
      async ctx => {
        await ctx.answerCbQuery();
        if (!ctx.callbackQuery) {
          await ctx.replyWithHTML(ctx.i18n.t('errors.missing-cb'));
          return ctx.wizard.back();
        }
        const shortId = ctx.callbackQuery.data;
        const count = await this.collectionRepository.count({where: {shortId}});
        if (count === 0) {
          await ctx.reply(
            ctx.i18n.t('errors.entityNotFound', {entity: 'Collection'}),
          );
          return ctx.scene.leave();
        } else if (count > 1) {
          throw Error(`ShortID is not unique: ${shortId}`);
        }
        ctx.session.collectionId = shortId;
        await ctx.replyWithHTML(ctx.i18n.t('collections.rename.prompt'));
        return ctx.wizard.next();
      },
      async ctx => {
        const newTitle = ctx.message!.text!.trim();
        if (newTitle.toLowerCase() === ctx.i18n.t('cancel').toLowerCase()) {
          await ctx.replyWithHTML(ctx.i18n.t('nevermind'));
          return ctx.scene.leave();
        }
        const shortId = ctx.session.collectionId;
        const collection = await this.collectionRepository.findOneOrFail({
          where: {shortId},
        });
        collection.title = newTitle;
        try {
          const {title} = await this.collectionRepository.save(collection);
          await ctx.replyWithHTML(
            ctx.i18n.t('collections.rename.success', {title}),
          );
          return ctx.scene.leave();
        } catch (e) {
          if (e.message.startsWith('duplicate key')) {
            this.logger.warn(e);
            await ctx.replyWithHTML(
              ctx.i18n.t('collections.duplicated', {title: newTitle}),
            );
          } else {
            throw e;
          }
        }
      },
    );
  }
}
