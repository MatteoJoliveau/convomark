import { Optional } from "typescript-optional";
import { injectable, inject } from "inversify";
import { BookmarkRepository } from "../inversify/interfaces";
import TYPES from "../inversify/types";
import { Bookmark } from "../entity/Bookmark";
import { Collection } from "../entity/Collection";

@injectable()
export class BookmarkService {
    private readonly repository: BookmarkRepository;

    constructor(@inject(TYPES.BookmarkRepository) BookmarkRepository: BookmarkRepository) {
        this.repository = BookmarkRepository;
    }
    
    getBookmark(filters: BookmarkParameters | { id: string }): Promise<Optional<Bookmark>> {
        return this.repository.findOne(filters).then(Optional.ofNullable);
    }

    getBookmarks(filters?: BookmarkParameters): Promise<Bookmark[]> {
        return this.repository.find(filters);
    }

    save(bookmark: Bookmark): Promise<Bookmark> {
        return this.repository.save(bookmark);
    }
}

export interface BookmarkParameters {
    messageLink: string;
}
