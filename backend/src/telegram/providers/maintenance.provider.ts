import {Provider} from '@loopback/core';

export class MaintenanceProvider implements Provider<boolean> {
  value(): boolean {
    const maintenance = process.env.TELEGRAM_BOT_MAINTENANCE || '';
    return maintenance.toLowerCase() === 'yes';
  }
}
