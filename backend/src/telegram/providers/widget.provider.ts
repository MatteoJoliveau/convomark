import {inject, Provider} from "@loopback/context";
// @ts-ignore
import TelegrafWidget, {Widget} from 'telegraf-widget';
import {TelegramWidgetBindings} from "../widgets";
import {MiddlewareProvider} from '../types';

export class WidgetProvider implements Provider<MiddlewareProvider> {
    constructor(
        @inject(TelegramWidgetBindings.COLLECTION_LIST) private collectionWidget: Widget,
    ) {}
    value(): TelegrafWidget {
        return new TelegrafWidget([
            this.collectionWidget,
        ]);
    }

}