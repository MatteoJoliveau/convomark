import Telegraf, {ContextMessageUpdate, Middleware} from 'telegraf';
import {
  ApplicationConfig,
  CoreBindings,
  inject,
  lifeCycleObserver,
  LifeCycleObserver,
} from '@loopback/core';
import {Update} from 'telegram-typings';
import * as Sentry from '@sentry/node';
// @ts-ignore
import {sendWidget} from 'telegraf-widget';
import {TelegramBindings} from './keys';
import {ApplicationMode, ConvoMarkBindings} from '../providers';
import {Loggable, Logger, logger} from '../logging';
import {TelegramCommandBindings} from './commands/keys';
import Stage from 'telegraf/stage';
import {MiddlewareProvider} from './types';
import {
  BookmarkRepository,
  CollectionRepository,
  TypeORMBindings,
  UserRepository,
} from '../typeorm';
import {TelegramWidgetBindings} from './widgets';
import {mapTelegramToUser} from '../mappers';
import {Collection} from '../models';

const {enter} = Stage;

@logger()
@lifeCycleObserver()
export class TelegramBot implements LifeCycleObserver, Loggable {
  logger: Logger;
  bot: Telegraf<ContextMessageUpdate>;

  constructor(
    @inject(TelegramBindings.TELEGRAM_TOKEN) token: string,
    @inject(TelegramBindings.TELEGRAM_SECRET) secret: Buffer,
    @inject(TelegramBindings.TELEGRAM_MAINTENANCE) maintenance: boolean,
    @inject(TelegramBindings.TELEGRAM_SESSION)
    sessionMiddleware: MiddlewareProvider,
    @inject(TelegramBindings.TELEGRAM_I18N)
    localizationMiddleware: MiddlewareProvider,
    @inject(TelegramWidgetBindings.WIDGET)
    widgetMiddleware: MiddlewareProvider,
    @inject(TelegramCommandBindings.COMMANDS)
    commands: Middleware<ContextMessageUpdate>[],
    @inject(ConvoMarkBindings.APPLICATION_MODE) private mode: ApplicationMode,
    @inject(CoreBindings.APPLICATION_CONFIG) {domain}: ApplicationConfig,
    @inject(TypeORMBindings.COLLECTION_REPOSITORY)
    collectionRepository: CollectionRepository,
    @inject(TypeORMBindings.USER_REPOSITORY)
    userRepository: UserRepository,
    @inject(TypeORMBindings.BOOKMARK_REPOSITORY)
    bookmarkRepository: BookmarkRepository,
  ) {
    const frontendDomain = process.env.FRONTEND_DOMAIN;
    this.bot = new Telegraf(token);

    if (maintenance) {
      this.setUpMaintenanceMode();
    }

    this.bot.use((ctx, next) => {
      if (next)
        return next().catch(async (e: Error) => {
          this.logger.error(e);
          const eventId = Sentry.captureException(e);
          await ctx.replyWithHTML(ctx.i18n.t('errors.sentry', {eventId}));
          ctx.session = null;
          return ctx.scene.leave();
        });
    });

    this.bot.use(async (ctx, next) => {
      const from = ctx.from!;
      ctx.state.currentUser = await userRepository
        .findOne(from.id!)
        .then(found => {
          if (found) return found;
          const mapped = mapTelegramToUser(from);
          return userRepository.save(mapped);
        })
        .then(async saved => {
          if ((await saved.collections).length === 0) {
            await collectionRepository.save(
              Collection.defaultCollection(saved),
            );
          }
          return saved;
        });
      Sentry.configureScope(scope => {
        const user = ctx.state.currentUser;
        scope.setUser({...user, id: user.id.toString()});
      });
      if (next) return next();
    });

    this.bot.use(sessionMiddleware.middleware());
    this.bot.use(localizationMiddleware.middleware());
    this.bot.use(widgetMiddleware.middleware());

    // Commands

    for (const command of commands) {
      this.bot.use(command);
    }

    // Core
    this.bot.start(({replyWithHTML, i18n, from}) => {
      return replyWithHTML(i18n.t('start', {from, frontendDomain}));
    });
    this.bot.help(({replyWithHTML, i18n}) => {
      return replyWithHTML(i18n.t('help', {frontendDomain}));
    });

    // Bookmarks
    this.bot.entity('url', enter('save-bookmark'));

    // Collections
    this.bot.command('collections', sendWidget('collections'));
    this.bot.command('collectioncreate', enter('create-collection'));
    this.bot.command('collectionrename', enter('rename-collection'));
    this.bot.command('collectiondelete', enter('delete-collection'));

    this.bot.on('message', ({from, reply, i18n}) => {
      return reply(i18n.t('greetings', {from}));
    });

    if (mode === 'production') {
      const webhook = `${domain}/bot/updates/${secret.toString('hex')}`;
      this.setUpWebhook(webhook).catch(this.logger.error.bind(this.logger));
    }
  }

  handleUpdate(rawUpdate: Update): Promise<object> {
    this.logger.debug({update: rawUpdate}, 'Processing update');
    return this.bot.handleUpdate(rawUpdate);
  }

  async start(): Promise<void> {
    if (this.mode !== 'production') {
      this.bot.startPolling().catch((e: string) => {
        this.logger.error(e);
        Sentry.captureException(e);
        throw new Error(e);
      });
    }
    const {username} = await this.bot.telegram.getMe();
    this.logger.info({username}, 'Bot is running');
    return Promise.resolve();
  }

  stop() {
    this.logger.info('Stopping the bot');
    this.bot.stop();
    this.logger.info('Stopped the bot');
  }

  async setUpWebhook(webhook: string): Promise<void> {
    try {
      const webhookInfo = await this.bot.telegram.getWebhookInfo();
      if (webhookInfo.url && webhookInfo.url === webhook) {
        this.logger.info('Webhook already set');
      } else {
        const success = await this.bot.telegram.setWebhook(webhook);
        if (success) {
          this.logger.info('Registered bot webook');
          this.logger.debug({webhook});
        } else {
          this.logger.error('Something went wrong when setting the webhook');
        }
      }
    } catch (e) {
      this.logger.error(e);
    }
  }

  setUpMaintenanceMode() {
    this.logger.warn('Activated maintenance mode');
    this.bot.use(({from, reply}) => {
      reply(`Hello ${from!.first_name}, the bot is under maintenance.
Please try again later`);
    });
  }
}
