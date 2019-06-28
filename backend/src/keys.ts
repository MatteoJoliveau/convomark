import {BindingKey} from '@loopback/core';
import {ApplicationMode} from './providers';

export namespace ConvoMarkBindings {
  export const APPLICATION_MODE = BindingKey.create<ApplicationMode>(
    'application.mode',
  );
}

export namespace SentryBindings {
  export const SENTRY_DSN = BindingKey.create<string | undefined>('sentry.dsn');
  export const SENTRY_ENV = BindingKey.create<string>('sentry.env');
}
