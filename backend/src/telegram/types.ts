/* eslint-disable @typescript-eslint/no-explicit-any */
import {ContextMessageUpdate} from 'telegraf';

export interface I18nContext {
  t(resourceKey: string, context: any): string;
  locale(): string;
  locale(languageCode: string): void;
}

declare module 'telegraf' {
  interface ContextMessageUpdate {
    session: any;
    i18n: I18nContext;
  }
}
