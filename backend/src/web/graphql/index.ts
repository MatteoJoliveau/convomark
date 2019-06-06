import { ApolloServer } from 'apollo-server-fastify';
import { getResolvers } from './resolvers';
import { UserService } from '../../service/user.service';
import { BookmarkService } from '../../service/bookmark.service';
import { CollectionService } from '../../service/collection.service';
import typeDefs from './types';

export async function createApolloServer(userService: UserService, bookmarkService: BookmarkService, collectionService: CollectionService): Promise<ApolloServer> {
    const resolvers = await getResolvers(userService, bookmarkService, collectionService);

    const server = new ApolloServer({
        typeDefs,
        resolvers,
    });

    return server;
}