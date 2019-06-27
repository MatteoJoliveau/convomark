import {
    Component,
    Binding,
    BindingScope,
    LifeCycleObserver,
    Constructor,
} from '@loopback/core';
import {TelegramBot} from './bot';
import {UpdateController} from './controllers';
import {
    TokenProvider,
    SecretProvider,
    SessionProvider,
    MaintenanceProvider,
    I18nProvider,
} from './providers';
import {TelegramBindings} from './keys';
import {TelegramCommandBindings} from './commands/keys';
import {
    CommandProvider, CreateCollectionSceneProvider,
    SaveBookmarksSceneProvider,
    StageProvider,
} from './commands';

export class TelegramComponent implements Component {
    providers = {
        [TelegramBindings.TELEGRAM_TOKEN.key]: TokenProvider,
        [TelegramBindings.TELEGRAM_SECRET.key]: SecretProvider,
        [TelegramBindings.TELEGRAM_SESSION.key]: SessionProvider,
        [TelegramBindings.TELEGRAM_I18N.key]: I18nProvider,
        [TelegramBindings.TELEGRAM_MAINTENANCE.key]: MaintenanceProvider,
        // Commands
        [TelegramCommandBindings.COMMANDS.key]: CommandProvider,
        [TelegramCommandBindings.STAGE.key]: StageProvider,
        [TelegramCommandBindings.SAVE_BOOKMARK_SCENE.key]: SaveBookmarksSceneProvider,
        [TelegramCommandBindings.CREATE_COLLECTION_SCENE.key]: CreateCollectionSceneProvider,
    };
    controllers = [UpdateController];
    bindings: Binding[];
    lifeCycleObservers: Constructor<LifeCycleObserver>[];

    constructor() {
        const botBinding = Binding.bind<TelegramBot>(TelegramBindings.TELEGRAM_BOT)
            .toClass(TelegramBot)
            .inScope(BindingScope.SINGLETON);
        this.bindings = [botBinding];

        this.lifeCycleObservers = [TelegramBot];
    }
}
