import {Provider} from '@loopback/core';

export class MaintenanceProvider implements Provider<boolean> {
  value(): boolean {
    return !!process.env.TELEGRAM_BOT_MAINTENANCE || false;
  }
}
