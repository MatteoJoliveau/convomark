import { Component, Binding, BindingScope, inject, CoreBindings, LifeCycleObserver, Constructor } from "@loopback/core";
import { RestApplication } from "@loopback/rest";
import { ConvoMarkBot } from "./bot";
import { UpdateController } from "./controller";
import { TokenProvider } from "./token.provider";

export class TelegramComponent implements Component {
  providers = {
    'telegram.token': TokenProvider,
  }
  controllers = [UpdateController]
  bindings: Binding[];
  lifeCycleObservers: Constructor<LifeCycleObserver>[];;

  constructor(
    @inject(CoreBindings.APPLICATION_INSTANCE)
    private app: RestApplication,
  ) {
    const botBinding = Binding.bind<ConvoMarkBot>('telegram.bot').toClass(ConvoMarkBot).inScope(BindingScope.SINGLETON);
    this.bindings = [botBinding];

    this.lifeCycleObservers = [ConvoMarkBot];
  }
}
