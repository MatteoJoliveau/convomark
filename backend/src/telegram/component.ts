import { Component, Binding, BindingScope, LifeCycleObserver, Constructor } from "@loopback/core";
import { TelegramBot } from "./bot";
import { UpdateController } from "./controllers";
import { TokenProvider } from "./providers";
import { TelegramBindings } from "./keys";

export class TelegramComponent implements Component {
  providers = {
    [TelegramBindings.TELEGRAM_TOKEN.key]: TokenProvider,
  }
  controllers = [UpdateController]
  bindings: Binding[];
  lifeCycleObservers: Constructor<LifeCycleObserver>[];

  constructor() {
    const botBinding = Binding.bind<TelegramBot>(TelegramBindings.TELEGRAM_BOT).toClass(TelegramBot).inScope(BindingScope.SINGLETON);
    this.bindings = [botBinding];

    this.lifeCycleObservers = [TelegramBot];
  }
}
