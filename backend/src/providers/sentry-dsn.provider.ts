import {Provider} from "@loopback/context";

export class SentryDSNProvider implements Provider<string | undefined> {
    value(): string | undefined {
        return process.env.SENTRY_DSN;
    }
}