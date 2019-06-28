import {BindingKey} from '@loopback/context';
// @ts-ignore
import TelegrafWidget, {Widget} from 'telegraf-widget';

export namespace TelegramWidgetBindings {
  export const WIDGET = BindingKey.create<TelegrafWidget>(
    'telegram.widgets.widget',
  );
  export const COLLECTION_LIST = BindingKey.create<Widget>(
    'telegram.widgets.collection-list',
  );
  export const BOOKMARK_LIST = BindingKey.create<Widget>(
    'telegram.widgets.bookmark-list',
  );
}
