import { Optional } from "typescript-optional";
import { injectable, inject } from "inversify";
import { MessageRepository } from "../inversify/interfaces";
import TYPES from "../inversify/types";
import { Bookmark } from "../entity/Bookmark";
import splitMessageLink from "../utils/splitMessageLink";

@injectable()
export class BookmarkService {
    private readonly repository: MessageRepository;

    constructor(@inject(TYPES.MessageRepository) MessageRepository: MessageRepository) {
        this.repository = MessageRepository;
    }
    
    getBookmark(filters: BookmarkParameters | { id: string }): Promise<Optional<Bookmark>> {
        return this.repository.findOne(filters).then(Optional.ofNullable);
    }

    getBookmarks(filters?: BookmarkParameters): Promise<Bookmark[]> {
        return this.repository.find(filters);
    }

    
    save(message: Bookmark): Promise<Bookmark> {
        return this.repository.save(message);
    }
}

export interface BookmarkParameters {
    messageLink: string;
}
