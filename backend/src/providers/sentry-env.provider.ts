import {Provider} from "@loopback/context";

export class SentryEnvProvider implements Provider<string> {
    value(): string {
        return process.env.SENTRY_CURRENT_ENV || 'development';
    }
}