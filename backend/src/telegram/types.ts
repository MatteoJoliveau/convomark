/* eslint-disable @typescript-eslint/no-explicit-any */
/// <reference path="telegraf.d.ts" />

import {Middleware, ContextMessageUpdate} from 'telegraf';
import WizardContext from 'telegraf/scenes/wizard/context';
import WizardScene from 'telegraf/scenes/wizard';

export interface MiddlewareProvider {
  middleware(): Middleware<ContextMessageUpdate>;
}

declare class I18nContext {
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
  }
}
