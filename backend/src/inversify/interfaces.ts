import { Repository } from "typeorm";
import { User } from "../entity/User";
import { Bookmark } from "../entity/Bookmark";
import { Telegraf, ContextMessageUpdate } from "telegraf";
import { FastifyInstance } from "fastify";

export type UserRepository = Repository<User>;
export type BookmarkRepository = Repository<Bookmark>;
export type BotProvider = () => Promise<Telegraf<ContextMessageUpdate>>;
export type FastifyProvider = () => Promise<FastifyInstance>;