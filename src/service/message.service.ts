import { Optional } from "typescript-optional";
import { injectable, inject } from "inversify";
import { MessageRepository } from "../inversify/interfaces";
import TYPES from "../inversify/types";
import { Message } from "../entity/Message";
import splitMessageLink from "../utils/splitMessageLink";
import { mapParamsToMessage } from "../mapper/message.mapper";

@injectable()
export class MessageService {
    private readonly repository: MessageRepository;

    constructor(@inject(TYPES.MessageRepository) MessageRepository: MessageRepository) {
        this.repository = MessageRepository;
    }
    
    async getMessage(id: string): Promise<Optional<Message>> {
        return await this.repository.findOne({ id }).then(Optional.ofNullable);
    }

    async getAllMessages(): Promise<Message[]> {
        return this.repository.find();
    }

    async getMessageFromLink(link: string): Promise<Message> {
            const filters = splitMessageLink(link);
            const foundMessage = await this.repository.findOne(filters);
            if (foundMessage) {
                return foundMessage;
            } else {
                const message = mapParamsToMessage(filters);
                return this.repository.save(message);
            }
    }
    
    save(message: Message): Promise<Message> {
        return this.repository.save(message);
    }
}
