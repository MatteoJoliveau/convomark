import {BindingKey} from '@loopback/core';
import Stage from 'telegraf/stage';
import {Middleware, ContextMessageUpdate} from 'telegraf';
import WizardScene from 'telegraf/scenes/wizard';

export namespace TelegramCommandBindings {
  export const COMMANDS = BindingKey.create<Middleware<ContextMessageUpdate>[]>(
    'telegram.commands',
  );
  export const SAVE_BOOKMARK_SCENE = BindingKey.create<WizardScene>(
    'telegram.commands.scenes.save-bookmark',
  );
  export const CREATE_COLLECTION_SCENE = BindingKey.create<WizardScene>(
    'telegram.commands.scenes.create-collection',
  );
  export const RENAME_COLLECTION_SCENE = BindingKey.create<WizardScene>(
    'telegram.commands.scenes.rename-collection',
  );
  export const DELETE_COLLECTION_SCENE = BindingKey.create<WizardScene>(
    'telegram.commands.scenes.delete-collection',
  );
  export const STAGE = BindingKey.create<Stage>('telegram.commands.stage');
}
