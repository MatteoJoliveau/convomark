import { ContextMessageUpdate } from "telegraf";
import { MessageEntity } from 'telegram-typings';
import { decorateWithLogger } from "graphql-tools";
import { Logger } from "pino";

export function messageText(ctx: ContextMessageUpdate): string {
    return ctx.message!.text!;
}

export function extractEntity(text: string, entity: MessageEntity): string {
    return text.substring(entity.offset, (entity.offset + entity.length));

}