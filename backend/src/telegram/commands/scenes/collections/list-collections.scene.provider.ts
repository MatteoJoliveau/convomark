/// <reference path="../../../telegraf.d.ts" />
import WizardScene from 'telegraf/scenes/wizard';
// @ts-ignore
import {Provider} from '@loopback/context';
import {Loggable, logger, Logger} from '../../../../logging';
import {repository} from '@loopback/repository';
import {CollectionRepository} from '../../../../repositories';

@logger()
export class CreateCollectionSceneProvider
  implements Provider<WizardScene>, Loggable {
  logger: Logger;

  constructor(
    @repository(CollectionRepository)
    private collectionRepository: CollectionRepository,
  ) {}

  value(): WizardScene {
    return new WizardScene('list-collections', async ctx => {
      await ctx.replyWithHTML(ctx.i18n.t('collections.create.step1'));
      return ctx.wizard.next();
    });
  }
}
