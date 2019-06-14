import { Provider } from "@loopback/core";

export class TokenProvider implements Provider<string> {
  value(): string {
    // return process.env.TELEGRAM_BOT_TOKEN || 'my-token'
    return process.env.TELEGRAM_BOT_TOKEN || '843711963:AAEJ5psS6A7ElEeU2BwHnMr0d-LILxpEW3Y'
  }
}
