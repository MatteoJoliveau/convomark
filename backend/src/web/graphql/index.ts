import { ApolloServer, AuthenticationError } from 'apollo-server-fastify';
import { getResolvers } from './resolvers';
import { UserService } from '../../service/user.service';
import { User } from '../../entity/User';
import { BookmarkService } from '../../service/bookmark.service';
import { CollectionService } from '../../service/collection.service';
import typeDefs from './types';
import { getLogger } from '../../logger';
const TOKEN_PREFIX = 'Bearer ';

export interface ConvoApolloContext {
    currentUser?: User,
    authenticationError?: AuthenticationError,
}

export async function createApolloServer(userService: UserService, bookmarkService: BookmarkService, collectionService: CollectionService): Promise<ApolloServer> {
    const logger = getLogger('apollo');
    const resolvers = await getResolvers(userService, bookmarkService, collectionService);

    const server = new ApolloServer({
        typeDefs,
        resolvers,
        context: async ({ req }) => {
            const context: ConvoApolloContext = {};
            const header = req.headers.authorization || TOKEN_PREFIX;
            const token = header.replace(TOKEN_PREFIX, '');
            if (token) {
                try {
                    const userOpt = await userService.getUserFromToken(token);
                    context.currentUser = userOpt.orUndefined();
                } catch (e) {
                    context.authenticationError = new AuthenticationError(e.message);
                }
            }
            return context;
        },
        formatResponse({ data }: any, { context }: { context: ConvoApolloContext }) {
            if (!data.__schema && context.authenticationError) {
                throw context.authenticationError;
            }
            return { data };
        }
    });

    return server;
}