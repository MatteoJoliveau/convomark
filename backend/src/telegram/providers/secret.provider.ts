import { Provider, inject } from "@loopback/context";
import {createHash} from 'crypto';
import { TelegramBindings } from "../keys";

export class SecretProvider implements Provider<Buffer> {
    constructor(
        @inject(TelegramBindings.TELEGRAM_TOKEN) private token: string,
    ) {}

    value(): Buffer {
        const hash = createHash('sha256');
        hash.update(this.token);
        return hash.digest();
    }
}