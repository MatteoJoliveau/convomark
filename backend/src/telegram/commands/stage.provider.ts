/// <reference path="../telegraf.d.ts" />
// @ts-ignore
import Stage from 'telegraf/stage';
// @ts-ignore
import WizardScene from 'telegraf/scenes/wizard';
import {Provider, inject} from '@loopback/context';
import {logger, Loggable, Logger} from '../../logging';
import {TelegramCommandBindings} from './keys';

@logger()
export class StageProvider implements Provider<Stage>, Loggable {
  logger: Logger;

  scenes: WizardScene[];

  constructor(
    @inject(TelegramCommandBindings.SAVE_BOOKMARK_SCENE)
    saveBookmarkScene: WizardScene,
    @inject(TelegramCommandBindings.CREATE_COLLECTION_SCENE)
    createCollectionScene: WizardScene,
  ) {
    this.scenes = [saveBookmarkScene, createCollectionScene];
  }

  value(): Stage {
    this.logger.debug('Initialized Telegram stage', this.scenes);
    return new Stage(this.scenes, {});
  }
}
