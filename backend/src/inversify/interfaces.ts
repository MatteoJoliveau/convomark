import { Repository } from "typeorm";
import { User } from "../entity/User";
import { Bookmark } from "../entity/Bookmark";
import { Collection } from "../entity/Collection";
import { Telegraf, ContextMessageUpdate } from "telegraf";
import { FastifyInstance } from "fastify";
import { ApolloServer } from "apollo-server-fastify";

export type UserRepository = Repository<User>;
export type BookmarkRepository = Repository<Bookmark>;
export type CollectionRepository = Repository<Collection>;
export type BotProvider = () => Promise<Telegraf<ContextMessageUpdate>>;
export type FastifyProvider = () => Promise<FastifyInstance>;
export type ApolloServerProvider = () => Promise<ApolloServer>;