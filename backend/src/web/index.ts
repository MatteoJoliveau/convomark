import { ApolloServer } from 'apollo-server-fastify';
import fastify, { FastifyInstance, FastifyReply } from 'fastify';
import cors from 'fastify-cors';
import jwt from 'fastify-jwt';
import { Telegraf, ContextMessageUpdate } from 'telegraf';
import { BOT_TOKEN } from '../bot';
import isProduction from '../utils/isProduction';
import { getLogger } from '../logger';
import { AuthenticationService, TokenSet } from '../service/auth.service';
import { VerifyErrors } from 'jsonwebtoken';
import { UserService } from '../service/user.service';
import { User } from '../entity/User';
import { ServerResponse } from 'http';

const WEB_DOMAIN = process.env.WEB_DOMAIN || 'http://localhost:3000';
const botCallbackPath = `/bot/${BOT_TOKEN}`;

async function sendTokenResponse({ accessToken, refreshToken }: TokenSet, user: User, app: FastifyInstance, reply: FastifyReply<ServerResponse>) {
    const signOptions = {...app.jwt.options.sign, subject: `${user.id}` };
    const access_token = app.jwt.sign(accessToken, signOptions);
    const refresh_token = (typeof(refreshToken) === 'string') ? refreshToken : app.jwt.sign(refreshToken, { ...signOptions, expiresIn: '2d' });
    reply.send({ access_token, token_type: 'bearer', expires_in: ((<number>signOptions.expiresIn) * 60), refresh_token });
}


export async function createFastifyInstance(bot: Telegraf<ContextMessageUpdate>, apollo: ApolloServer, authService: AuthenticationService, userService: UserService): Promise<FastifyInstance> {
    const logger = getLogger('fastify');

    const app = fastify();

    if (isProduction && WEB_DOMAIN.startsWith('https')) {
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
        secret: authService.tokenSecret,
        sign: {
            issuer: WEB_DOMAIN,
            expiresIn: (isProduction ? 120 : 3600),
        },
        verify: {
            issuer: WEB_DOMAIN,
        }
    })

    app.post('/auth/token', {}, async (request, reply) => {
        const { grant_type, refresh_token, ...userData } = request.body;
        switch(grant_type) {
            case 'telegram': {
                try {
                const tokenRequest = await authService.validateTokenRequest(userData);
                    const user = await userService.getOrCreateUser({ ...tokenRequest, is_bot: false });
                    const tokens = await authService.generateTokenSet(user);
                    sendTokenResponse(tokens, user, app, reply);
                } catch (e) {
                    logger.error(e);
                    const err = new Error(e);
                    (<any> err).statusCode = 401;
                    reply.send(err);
                } 
                break;
            }
            case 'refresh_token': {
                app.jwt.verify(refresh_token, async (err: VerifyErrors, decoded: object | string) => {
                    if (err) {
                        logger.error(err);
                        reply.send(err);
                    } else {
                        const { sub } = <{ sub: string }>decoded;
                        const userOpt = await userService.getUser({ id: parseInt(sub) });
                        userOpt.ifPresentOrElse(
                        async (user) => {
                            const tokens = await authService.generateTokenSet(user, refresh_token);
                            logger.info('Refreshing token set', { user: { id: user.id } });
                            sendTokenResponse(tokens, user, app, reply);
                        },
                        () => {
                            logger.warn('User not found', { id: sub });
                            const err = new Error('Unauthorized');
                            (<any> err).statusCode = 401;
                            reply.send(err);
                        });
                    }
                });
                break;
            }
        }
       
    });
    
    return app;
}
