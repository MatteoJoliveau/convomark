/* eslint-disable @typescript-eslint/no-explicit-any */
import {ContextMessageUpdate} from 'telegraf';

declare module 'telegraf' {
  interface ContextMessageUpdate {
    session: any;
  }
}
