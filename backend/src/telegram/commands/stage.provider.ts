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
    saveBookmark: WizardScene,
    @inject(TelegramCommandBindings.CREATE_COLLECTION_SCENE)
    createCollection: WizardScene,
    @inject(TelegramCommandBindings.RENAME_COLLECTION_SCENE)
    renameCollection: WizardScene,
    @inject(TelegramCommandBindings.DELETE_COLLECTION_SCENE)
    deleteCollection: WizardScene,
  ) {
    this.scenes = [
        saveBookmark,
        createCollection,
        renameCollection,
        deleteCollection,
    ];
  }

  value(): Stage {
    this.logger.debug(this.scenes, 'Initialized Telegram stage');
    return new Stage(this.scenes, {});
  }
}
