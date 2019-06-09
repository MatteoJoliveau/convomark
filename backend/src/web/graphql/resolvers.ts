import { UserService } from "../../service/user.service";
import { BookmarkService } from "../../service/bookmark.service";
import { CollectionService } from "../../service/collection.service";
import count from '../../utils/count';
import { User } from "../../entity/User";
import { Bookmark } from "../../entity/Bookmark";
import { Collection } from "../../entity/Collection";
import { getLogger } from "../../logger";
import { ConvoApolloContext } from '.';

export async function getResolvers(userService: UserService, bookmarkService: BookmarkService, collectionService: CollectionService): Promise<object> {
    const logger = getLogger('resolvers');
    const resolvers = {
        Query: {
            currentUser: (_parent: any, _args: any, { currentUser }: ConvoApolloContext) => (currentUser)
        },
        User: {
            collections: (user: User) =>  (user.collections),
            collection: async (user: User, { slug }: { slug: string }) => {
                const optional = await collectionService.findOneByUser({ user, slug });
                return optional.orNull();
            },
        },
        Collection: {
            bookmarks: (collection: Collection) => (collection.bookmarks),
            bookmarkCount: (collection: Collection) => (collection.bookmarks.then(count)),
        }
    };
    return resolvers;
}
