import repl from 'repl';
import {Context} from 'vm';
import {ConvoMarkApplication} from './application';
import {ConvoMarkBindings} from './keys';
import {TelegramBindings} from './telegram/keys';
import {TypeORMBindings} from './typeorm/keys';
import {TelegramBot} from './telegram/bot';
import lodash from 'lodash';
const Models = require('./models');

process.env.LOG_LEVEL = 'info';

async function addRepositories(ctx: Context, app: ConvoMarkApplication) {
  const userRepoP = app.get(TypeORMBindings.USER_REPOSITORY);
  const collectionRepoP = app.get(TypeORMBindings.COLLECTION_REPOSITORY);
  const bookmarkRepoP = app.get(TypeORMBindings.BOOKMARK_REPOSITORY);
  const [userRepo, collectionRepo, bookmarkRepo] = await Promise.all([
    userRepoP,
    collectionRepoP,
    bookmarkRepoP,
  ]);
  ctx.userRepo = userRepo;
  ctx.collectionRepo = collectionRepo;
  ctx.bookmarkRepo = bookmarkRepo;
}

async function addModels(ctx: Context) {
  for (const model of Object.keys(Models)) {
    ctx[model] = Models[model];
  }
}

async function addBot(ctx: Context, app: ConvoMarkApplication) {
  const {bot}: TelegramBot = await app.get(TelegramBindings.TELEGRAM_BOT);
  ctx.bot = bot;
}

function addUtility(ctx: Context) {
  ctx.lodash = lodash;
}

async function shell(args: string[]) {
  console.log('Starting interactive console', {args});
  const app = new ConvoMarkApplication();
  await app.boot();

  const mode = await app.get(ConvoMarkBindings.APPLICATION_MODE);
  const ctx = repl.start(`loopback (${mode})> `).context;
  addRepositories(ctx, app);
  addModels(ctx);
  addBot(ctx, app);
  addUtility(ctx);
  ctx.app = app;
}

shell(process.argv).catch(err => {
  console.error('Cannot start interactive console', err);
  process.exit(1);
});
