import { ApolloServer } from 'apollo-server-fastify';
import fastify, { FastifyInstance } from 'fastify';
import cors from 'fastify-cors';
import jwt from 'fastify-jwt';
import { Telegraf, ContextMessageUpdate } from 'telegraf';
import { BOT_TOKEN } from '../bot';
import isProduction from '../utils/isProduction';
import { getLogger } from '../logger';
import { AuthenticationService } from '../service/auth.service';

const { WEB_DOMAIN } = process.env;
const botCallbackPath = `/bot/${BOT_TOKEN}`;


export async function createFastifyInstance(bot: Telegraf<ContextMessageUpdate>, apollo: ApolloServer, authService: AuthenticationService): Promise<FastifyInstance> {
    const logger = getLogger('fastify');

    const app = fastify();

    if (isProduction) {
        app.use(bot.webhookCallback(botCallbackPath));
        bot.telegram.setWebhook(`${WEB_DOMAIN}${botCallbackPath}`);
    } else {
        bot.launch();
    }

    app.register(apollo.createHandler());
    app.register(cors, {
       origin: true,
    });
    app.register(jwt, {
        secret: 'test',
        sign: {
            issuer: WEB_DOMAIN,
            expiresIn: 300,
        },
        verify: {
            issuer: WEB_DOMAIN,
        }
    })

    app.post('/auth/token', {}, (request, reply) => {
        authService.validateTokenRequest(request.body)
            .then((tokenRequest) => {
                const { id, first_name, last_name, username, photo_url } = tokenRequest;
                const signOptions = {...app.jwt.options.sign, subject: `${id}` }
                const access_token = app.jwt.sign( { first_name, last_name, username, photo_url, typ: 'Bearer' }, signOptions);
                const refresh_token = app.jwt.sign( { typ: 'Refresh' }, { ...signOptions, expiresIn: '2d' });
                reply.send({ access_token, token_type: 'bearer', expires_in: ((<number>signOptions.expiresIn) * 60), refresh_token });
            })
            .catch((error) => {
                logger.error(error);
                const err = new Error(error);
                (<any> err).statusCode = 401;
                reply.send(err);
            });
    });
    
    return app;
}
