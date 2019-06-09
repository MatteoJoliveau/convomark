import { ApolloServer } from "apollo-server-fastify";
import { FastifyInstance } from "fastify";
import { ContextMessageUpdate, Telegraf } from "telegraf";
import { Repository } from "typeorm";
import { Bookmark } from "../entity/Bookmark";
import { Collection } from "../entity/Collection";
import { User } from "../entity/User";

export type UserRepository = Repository<User>;
export type BookmarkRepository = Repository<Bookmark>;
export type CollectionRepository = Repository<Collection>;
export type BotProvider = () => Promise<Telegraf<ContextMessageUpdate>>;
export type FastifyProvider = () => Promise<FastifyInstance>;
export type ApolloServerProvider = () => Promise<ApolloServer>;

export interface TelegramTokenRequest {
    id: number;
    first_name: string;
    last_name?: string;
    username?: string;
    photo_url?: string;
    auth_date: number;
    hash: string;
}