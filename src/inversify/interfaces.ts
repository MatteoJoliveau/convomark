import { Repository } from "typeorm";
import { User } from "../entity/User";
import { Message } from "../entity/Message";
import { Telegraf, ContextMessageUpdate } from "telegraf";
import { FastifyInstance } from "fastify";

export type UserRepository = Repository<User>;
export type MessageRepository = Repository<Message>;
export type BotProvider = () => Promise<Telegraf<ContextMessageUpdate>>;
export type FastifyProvider = () => Promise<FastifyInstance>;