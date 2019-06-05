import { Container } from 'inversify';
import { UserService } from '../service/user.service';
import { Repository, getRepository } from 'typeorm';
import { UserRepository, BotProvider, FastifyProvider, MessageRepository } from './interfaces';
import { User } from '../entity/User';
import { Message } from '../entity/Message';
import TYPES from './types';
import { Telegraf, ContextMessageUpdate } from 'telegraf';
import { createBot } from '../bot';
import { FastifyInstance } from 'fastify';
import { createFastifyInstance } from '../web';
import { MessageService } from '../service/message.service';


async function getContainer(): Promise<Container> {
    const container = new Container();

    container.bind<UserRepository>(TYPES.UserRepository).toConstantValue(getRepository(User));
    container.bind<MessageRepository>(TYPES.MessageRepository).toConstantValue(getRepository(Message));
    container.bind<UserService>(UserService).toSelf().inSingletonScope();
    container.bind<MessageService>(MessageService).toSelf().inSingletonScope();
    container.bind<BotProvider>(TYPES.BotProvider).toProvider<Telegraf<ContextMessageUpdate>>((context) => () => {
        const userService = context.container.get<UserService>(UserService);
        const messageService = context.container.get<MessageService>(MessageService);
        return createBot(userService, messageService);
    });
    container.bind<FastifyProvider>(TYPES.FastifyProvider).toProvider<FastifyInstance>((context) => async () => {
        const botProvider = context.container.get<BotProvider>(TYPES.BotProvider);
        const bot = await botProvider()
        return createFastifyInstance(bot);
    });

    return container;    
}


export { getContainer };