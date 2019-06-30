/// <reference path="../../../telegraf.d.ts" />
import WizardScene from 'telegraf/scenes/wizard';
import {inject, Provider} from '@loopback/context';
import {Loggable, logger, Logger} from '../../../../logging';
import {CollectionRepository, TypeORMBindings} from '../../../../typeorm';
import {Collection} from '../../../../models';

@logger()
export class CreateCollectionSceneProvider
  implements Provider<WizardScene>, Loggable {
  logger: Logger;

  constructor(
    @inject(TypeORMBindings.COLLECTION_REPOSITORY)
    private collectionRepository: CollectionRepository,
  ) {}

  value(): WizardScene {
    return new WizardScene(
      'create-collection',
      async ctx => {
        await ctx.replyWithHTML(ctx.i18n.t('collections.create.step1'));
        return ctx.wizard.next();
      },
      async ctx => {
        const {currentUser: user} = ctx.state;
        const newTitle = ctx.message!.text!.trim();
        if (newTitle.toLowerCase() === ctx.i18n.t('cancel').toLowerCase()) {
          await ctx.replyWithHTML(ctx.i18n.t('nevermind'));
          return ctx.scene.leave();
        }
        const collection = new Collection({
          title: newTitle,
          user,
        });
        try {
          const {id, title, slug} = await this.collectionRepository.save(
            collection,
          );
          this.logger.debug({id, slug, title, user}, 'Created new collection');
          await ctx.replyWithHTML(
            ctx.i18n.t('collections.create.success', {title}),
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
