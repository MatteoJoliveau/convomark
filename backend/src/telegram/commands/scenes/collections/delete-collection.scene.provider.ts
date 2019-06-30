/// <reference path="../../../telegraf.d.ts" />
import WizardScene from 'telegraf/scenes/wizard';
// @ts-ignore
import {inject, Provider} from '@loopback/context';
import {Loggable, logger, Logger} from '../../../../logging';
import {CollectionRepository, TypeORMBindings} from '../../../../typeorm';
import {Markup} from "telegraf";

@logger()
export class DeleteCollectionSceneProvider
    implements Provider<WizardScene>, Loggable {
    logger: Logger;

    constructor(
        @inject(TypeORMBindings.COLLECTION_REPOSITORY)
        private collectionRepository: CollectionRepository,
    ) {
    }

    value(): WizardScene {
        return new WizardScene('delete-collection', async ctx => {
                const {currentUser} = ctx.state;
                this.logger.debug({currentUser}, 'Deleting user collection');
                const collections = await currentUser.collections;
                const buttons = collections.map(({shortId, title}) => (
                    Markup.callbackButton(title, shortId)
                ));
                this.logger.debug({buttons}, 'Building collection buttons');
                // @ts-ignore
                const extra = Markup.inlineKeyboard(buttons, {columns: 3}).extra();
                const message = ctx.i18n.t('collections.delete.list');
                await ctx.replyWithHTML(message, extra);
                return ctx.wizard.next();
            },
            async ctx => {
                await ctx.answerCbQuery();
                if (!ctx.callbackQuery) {
                    await ctx.replyWithHTML(ctx.i18n.t('errors.missing-cb'));
                    return ctx.wizard.back();
                }
                const shortId = ctx.callbackQuery.data;
                const count = await this.collectionRepository.count({where: {shortId}});
                if (count === 0) {
                    await ctx.reply(ctx.i18n.t('errors.entityNotFound', {entity: 'Collection'}));
                    return ctx.scene.leave();
                } else if (count > 1) {
                    throw Error(`ShortID is not unique: ${shortId}`);
                }
                ctx.session.collectionId = shortId;
                const extra = Markup.inlineKeyboard([
                    Markup.callbackButton(ctx.i18n.t('yes'), 'yes'),
                    Markup.callbackButton(ctx.i18n.t('no'), 'no'),
                    // @ts-ignore
                ]).extra();
                await ctx.replyWithHTML(ctx.i18n.t('collections.delete.prompt'), extra);
                return ctx.wizard.next();
            },
            async ctx => {
                await ctx.answerCbQuery();
                if (!ctx.callbackQuery) {
                    await ctx.replyWithHTML(ctx.i18n.t('errors.missing-cb'));
                    return ctx.wizard.back();
                }
                const answer = ctx.callbackQuery.data;
                if (answer === 'no') {
                    await ctx.replyWithHTML(ctx.i18n.t('collections.delete.abort'));
                    return ctx.scene.leave();
                }
                const shortId = ctx.session.collectionId;
                const collection = await this.collectionRepository.findOneOrFail({where: {shortId}});
                const {title} = await this.collectionRepository.remove(collection);
                await ctx.replyWithHTML(ctx.i18n.t('collections.delete.success', {title}));
                return ctx.scene.leave();
            });
    }
}
