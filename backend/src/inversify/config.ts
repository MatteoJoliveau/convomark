import { Container } from 'inversify';
import { UserService } from '../service/user.service';
import { getRepository } from 'typeorm';
import { UserRepository, BotProvider, FastifyProvider, BookmarkRepository, ApolloServerProvider, CollectionRepository } from './interfaces';
import { User } from '../entity/User';
import { Bookmark } from '../entity/Bookmark';
import { Collection } from '../entity/Collection';
import TYPES from './types';
import { Telegraf, ContextMessageUpdate } from 'telegraf';2
import { createBot } from '../bot';
import { FastifyInstance } from 'fastify';
import { createFastifyInstance } from '../web';
import { createApolloServer } from '../web/graphql';
import { BookmarkService } from '../service/bookmark.service';
import { CollectionService } from '../service/collection.service';
import { ApolloServer } from 'apollo-server-fastify';


async function getContainer(): Promise<Container> {
    const container = new Container();

    container.bind<UserRepository>(TYPES.UserRepository).toConstantValue(getRepository(User));
    container.bind<BookmarkRepository>(TYPES.BookmarkRepository).toConstantValue(getRepository(Bookmark));
    container.bind<CollectionRepository>(TYPES.CollectionRepository).toConstantValue(getRepository(Collection));
    container.bind<UserService>(UserService).toSelf().inSingletonScope();
    container.bind<BookmarkService>(BookmarkService).toSelf().inSingletonScope();
    container.bind<CollectionService>(CollectionService).toSelf().inSingletonScope();
    container.bind<BotProvider>(TYPES.BotProvider).toProvider<Telegraf<ContextMessageUpdate>>((context) => () => {
        const userService = context.container.get<UserService>(UserService);
        const bookmarkService = context.container.get<BookmarkService>(BookmarkService);
        const collectionService = context.container.get<CollectionService>(CollectionService);
        return createBot(userService, bookmarkService, collectionService);
    });
    container.bind<ApolloServerProvider>(TYPES.ApolloServerProvider).toProvider<ApolloServer>((context) => async () => {
        const userService = context.container.get<UserService>(UserService);
        const bookmarkService = context.container.get<BookmarkService>(BookmarkService);
        const collectionService = context.container.get<CollectionService>(CollectionService);
        return createApolloServer(userService, bookmarkService, collectionService);
    });
    container.bind<FastifyProvider>(TYPES.FastifyProvider).toProvider<FastifyInstance>((context) => async () => {
        const botProvider = context.container.get<BotProvider>(TYPES.BotProvider);
        const apolloProvider = context.container.get<ApolloServerProvider>(TYPES.ApolloServerProvider);
        const bot = await botProvider()
        const apollo = await apolloProvider();
        return createFastifyInstance(bot, apollo);
    });

    return container;    
}


export { getContainer };