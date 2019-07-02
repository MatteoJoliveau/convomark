import {ConvoMarkApplication} from './application';
import {ApplicationConfig} from '@loopback/core';

export {ConvoMarkApplication};

export async function main(options: ApplicationConfig = {}) {
  const app = new ConvoMarkApplication(options);
  await app.boot();
  await app.start();

  const url = app.restServer.url;
  app.logger.info(`Server is running at ${url}`);

  return app;
}
