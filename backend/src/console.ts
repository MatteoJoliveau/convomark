import repl from 'repl';
import {ConvoMarkApplication} from './application';
import { ConvoMarkBindings } from './keys';

export async function shell(args: string[]) {
  console.log('Starting interactive console', {args});
  const app = new ConvoMarkApplication();
  await app.boot();

  const mode = await app.get(ConvoMarkBindings.APPLICATION_MODE);
  const r = repl.start(`${mode}> `);
  r.context.app = app;
}

shell(process.argv).catch(err => {
  console.error('Cannot start interactive console', err);
  process.exit(1);
});
