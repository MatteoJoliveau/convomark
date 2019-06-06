import { UserService } from "../../service/user.service";
import { BookmarkService } from "../../service/bookmark.service";
import { CollectionService } from "../../service/collection.service";
import { first } from 'lodash';
import { User } from "../../entity/User";
import { Bookmark } from "../../entity/Bookmark";
import { Collection } from "../../entity/Collection";
import { getLogger } from "../../logger";

export async function getResolvers(userService: UserService, bookmarkService: BookmarkService, collectionService: CollectionService): Promise<object> {
    const logger = getLogger('resolvers');
    const resolvers = {
        Query: {
            currentUser: () => userService.getUsers().then(first)
        },
        User: {
            collections: (user: User) =>  collectionService.findByUser(user)
        },
        Collection: {
            bookmarks: (collection: Collection) => collection.bookmarks
        }
    };
    return resolvers;
}
