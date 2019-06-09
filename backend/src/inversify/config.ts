import { Container } from "inversify";
import { ContextMessageUpdate, Telegraf } from "telegraf"; 2;
import { getRepository } from "typeorm";
import { Bookmark } from "../entity/Bookmark";
import { Collection } from "../entity/Collection";
import { User } from "../entity/User";
import { UserService } from "../service/user.service";
import { ApolloServerProvider, BookmarkRepository, BotProvider, CollectionRepository, FastifyProvider, UserRepository } from "./interfaces";
import TYPES from "./types";
import { ApolloServer } from "apollo-server-fastify";
import { FastifyInstance } from "fastify";
import { createBot } from "../bot";
import { AuthenticationService } from "../service/auth.service";
import { BookmarkService } from "../service/bookmark.service";
import { CollectionService } from "../service/collection.service";
import { createFastifyInstance } from "../web";
import { createApolloServer } from "../web/graphql";

async function getContainer(): Promise<Container> {
    const container = new Container();

    container.bind<UserRepository>(TYPES.UserRepository).toConstantValue(getRepository(User));
    container.bind<BookmarkRepository>(TYPES.BookmarkRepository).toConstantValue(getRepository(Bookmark));
    container.bind<CollectionRepository>(TYPES.CollectionRepository).toConstantValue(getRepository(Collection));
    container.bind<UserService>(UserService).toSelf().inSingletonScope();
    container.bind<BookmarkService>(BookmarkService).toSelf().inSingletonScope();
    container.bind<CollectionService>(CollectionService).toSelf().inSingletonScope();
    container.bind<AuthenticationService>(AuthenticationService).toSelf().inSingletonScope();
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
        const authService = context.container.get<AuthenticationService>(AuthenticationService);
        const userService = context.container.get<UserService>(UserService);
        const bot = await botProvider();
        const apollo = await apolloProvider();
        return createFastifyInstance(bot, apollo, authService, userService);
    });

    return container;
}

export { getContainer };