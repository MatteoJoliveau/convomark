/// <reference path="../../../telegraf.d.ts" />
import WizardScene from 'telegraf/scenes/wizard';
import {Markup} from 'telegraf';
import {Provider} from '@loopback/context';
import {logger, Loggable, Logger} from '../../../../logging';
import {repository} from '@loopback/repository';
import {
    CollectionRepository,
} from '../../../../repositories';
import {Collection, Bookmark, BookmarkCollection} from '../../../../models';
import * as Sentry from '@sentry/node';

@logger()
export class CreateCollectionSceneProvider
    implements Provider<WizardScene>, Loggable {
    logger: Logger;

    constructor(
        @repository(CollectionRepository) private collectionRepository: CollectionRepository
    ) {
    }

    value(): WizardScene {
        return new WizardScene(
            'create-collection',
            async ctx => {
                await ctx.replyWithHTML(ctx.i18n.t('collections.create.step1'));
                return ctx.wizard.next();
            },
            async ctx => {
                const user = ctx.from!;
                const userId = user.id;
                const title = ctx.message!.text!;
                if (title.toLowerCase() === ctx.i18n.t('cancel').toLowerCase()) {
                    await ctx.replyWithHTML(ctx.i18n.t('collections.create.nevermind'));
                    return ctx.scene.leave();
                }
                const collection = new Collection({
                    title,
                    userId
                });
                try {
                    const { id, title, slug } = await this.collectionRepository.create(collection);
                    this.logger.debug('Created new collection', { id, slug, title, user });
                    await ctx.replyWithHTML(ctx.i18n.t('collections.create.success', {title}));
                    return ctx.scene.leave();
                } catch (e) {
                    if (e.message.startsWith('duplicate key')) {
                        this.logger.warn(e);
                        await ctx.replyWithHTML(ctx.i18n.t('collections.create.duplicated', {title}));
                    } else {
                        this.logger.error(e);
                        const eventId = Sentry.captureException(e);
                        await ctx.replyWithHTML(ctx.i18n.t('sentry.error', {eventId}));
                        await ctx.scene.leave();
                    }
                }
            },
        );
    }
}
