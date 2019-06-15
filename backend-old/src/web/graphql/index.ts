import { ApolloServer, AuthenticationError, ApolloError } from 'apollo-server-fastify';
import { getResolvers } from './resolvers';
import { UserService } from '../../service/user.service';
import { User } from '../../entity/User';
import { BookmarkService } from '../../service/bookmark.service';
import { CollectionService } from '../../service/collection.service';
import typeDefs from './types';
import { getLogger } from '../../logger';
const TOKEN_PREFIX = 'Bearer ';

export class NotFoundError extends ApolloError {
    constructor(message: string, properties: { id: string }) {
        super(message, 'NOT_FOUND', properties);
    }
}

export interface ConvoApolloContext {
    currentUser: User,
    authenticationError?: AuthenticationError,
}

export async function createApolloServer(userService: UserService, bookmarkService: BookmarkService, collectionService: CollectionService): Promise<ApolloServer> {
    const logger = getLogger('apollo');
    const resolvers = await getResolvers(userService, bookmarkService, collectionService);

    const server = new ApolloServer({
        typeDefs,
        resolvers,
        context: async ({ req }) => {
            const header = req.headers.authorization || TOKEN_PREFIX;
            const token = header.replace(TOKEN_PREFIX, '');
            try {
                const userOpt = await userService.getUserFromToken(token);
                const currentUser = userOpt.orElseThrow(() => new NotFoundError('User not found', { id: '' }));
                return { currentUser }
            } catch (e) {
                throw new AuthenticationError(e.message);
            }
        },
        formatError(error) {
            const message = error.message.replace('Context creation failed: ', '');
            return { ...error, message };
        }
    });

    return server;
}