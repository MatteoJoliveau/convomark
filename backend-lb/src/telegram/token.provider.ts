import { Provider } from "@loopback/core";

export class TokenProvider implements Provider<string> {
  value(): string {
    // return process.env.TELEGRAM_BOT_TOKEN || 'my-token'
    return process.env.TELEGRAM_BOT_TOKEN || '394969106:AAHW4ybr3YaVZDot8h81_3kzlYtcRsgBfo8'
  }
}
