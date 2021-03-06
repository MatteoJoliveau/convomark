/* eslint-disable @typescript-eslint/no-explicit-any */
/// <reference path="telegraf.d.ts" />

import {ContextMessageUpdate, HearsTriggers, Middleware} from 'telegraf';
import WizardContext from 'telegraf/scenes/wizard/context';
import WizardScene from 'telegraf/scenes/wizard';
import {User} from '../models';

export interface MiddlewareProvider {
  middleware(): Middleware<ContextMessageUpdate>;
}

export declare class I18nContext {
  t(resourceKey: string, context?: any): string;

  locale(): string;
  locale(languageCode: string): void;
}

declare module 'telegraf' {
  interface Composer<TContext extends ContextMessageUpdate> {
    entity(
      entity: HearsTriggers,
      middleware: Middleware<ContextMessageUpdate>,
    ): Composer<TContext>;
  }

  interface ContextMessageUpdate {
    session: any;
    i18n: I18nContext;
    wizard: WizardContext;
    scene: WizardScene;
    widget: any;
    state: ContextState;
  }

  interface ContextState {
    currentUser: User;
  }
}

export interface CrudMiddlewares {
  create: Middleware<ContextMessageUpdate>;
  read: Middleware<ContextMessageUpdate>;
  update: Middleware<ContextMessageUpdate>;
  delete: Middleware<ContextMessageUpdate>;
}
