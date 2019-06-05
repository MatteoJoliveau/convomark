import { Message } from "../entity/Message";

export function mapParamsToMessage({ chatUsername, messageId }: { chatUsername: string, messageId: number }): Message {
    const message = new Message();
    message.chatUsername = chatUsername;
    message.messageId = messageId;
    return message;
}

export function mapMessageToLink(message: Message): string {
    return `https://t.me/${message.chatUsername}/${message.messageId}`;
}