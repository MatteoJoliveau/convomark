import { Middleware, ContextMessageUpdate} from 'telegraf';
import { Provider, inject } from '@loopback/context';
import { TelegramCommandBindings } from './keys';
import Stage from 'telegraf/stage';

export class CommandProvider implements Provider<Middleware<ContextMessageUpdate>[]> {
    constructor(
       @inject(TelegramCommandBindings.STAGE) private stage: Stage,
    ) {}

    value(): Middleware<ContextMessageUpdate>[] {
        return [
            this.stage.middleware(),
        ];
    }
}

export * from './stage.provider';
export * from './scenes';