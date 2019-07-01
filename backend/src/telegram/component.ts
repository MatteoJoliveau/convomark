import {Binding, BindingScope, Component, Constructor, LifeCycleObserver,} from '@loopback/core';
import {TelegramBot} from './bot';
import {UpdateController} from './controllers';
import {
    I18nProvider,
    MaintenanceProvider,
    SecretProvider,
    SessionProvider,
    TokenProvider,
    WidgetProvider,
} from './providers';
import {TelegramBindings} from './keys';
import {TelegramCommandBindings} from './commands/keys';
import {
    CommandProvider,
    CreateCollectionSceneProvider,
    RenameCollectionSceneProvider,
    SaveBookmarksSceneProvider,
    StageProvider,
} from './commands';
import {BookmarkListWidgetProvider, CollectionListWidgetProvider, TelegramWidgetBindings,} from './widgets';
import {DeleteCollectionSceneProvider} from './commands/scenes/collections/delete-collection.scene.provider';

export class TelegramComponent implements Component {
    providers = {
        [TelegramBindings.TELEGRAM_TOKEN.key]: TokenProvider,
        [TelegramBindings.TELEGRAM_SECRET.key]: SecretProvider,
        [TelegramBindings.TELEGRAM_SESSION.key]: SessionProvider,
        [TelegramBindings.TELEGRAM_I18N.key]: I18nProvider,
        [TelegramBindings.TELEGRAM_MAINTENANCE.key]: MaintenanceProvider,
        // Widgets
        [TelegramWidgetBindings.WIDGET.key]: WidgetProvider,
        [TelegramWidgetBindings.COLLECTION_LIST.key]: CollectionListWidgetProvider,
        [TelegramWidgetBindings.BOOKMARK_LIST.key]: BookmarkListWidgetProvider,
        // Commands
        [TelegramCommandBindings.COMMANDS.key]: CommandProvider,
        [TelegramCommandBindings.STAGE.key]: StageProvider,
        [TelegramCommandBindings.SAVE_BOOKMARK_SCENE
            .key]: SaveBookmarksSceneProvider,
        [TelegramCommandBindings.CREATE_COLLECTION_SCENE
            .key]: CreateCollectionSceneProvider,
        [TelegramCommandBindings.RENAME_COLLECTION_SCENE
            .key]: RenameCollectionSceneProvider,
        [TelegramCommandBindings.DELETE_COLLECTION_SCENE
            .key]: DeleteCollectionSceneProvider,
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
