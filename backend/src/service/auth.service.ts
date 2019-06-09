import { injectable } from "inversify";
import { TelegramTokenRequest } from "../inversify/interfaces";
import { differenceInMinutes } from 'date-fns';
import { sortBy, filter } from 'lodash';
import {createHmac, createHash, Hmac} from 'crypto';
import { BOT_TOKEN } from "../bot";
import { getLogger } from "../logger";
import { Logger } from "pino";
import { User } from "../entity/User";
import { verify } from 'jsonwebtoken';

@injectable()
export class AuthenticationService {
    private readonly logger: Logger;
    private readonly telegramSecret: Buffer;
    readonly tokenSecret = 'test';

    constructor() {
        this.logger = getLogger('AuthenticationService');
        const hash = createHash('sha256');
        hash.update(BOT_TOKEN);
        this.telegramSecret = hash.digest();
    }

    validateTokenRequest(request: TelegramTokenRequest): Promise<TelegramTokenRequest> {
        return this.validateAuthenticationDate(new Date(request.auth_date * 1000))
            .then(this.validateAuthenticationHash(request));

    }

    generateTokenSet(user: User, previousRefreshToken?: string): TokenSet {
        const { firstName, lastName, languageCode, username, photoUrl } = user;
        const accessToken: AccessToken = { 
            first_name: firstName,
            last_name: lastName,
            username,
            language_code: languageCode,
            photo_url: photoUrl,
            typ: 'Bearer' 
        };
        const refreshToken: RefreshToken = { typ: 'Refresh' };
        return { accessToken, refreshToken: (previousRefreshToken || refreshToken) };
    }

    decodeToken(token: string): Promise<TokenPayload> {
        return new Promise((resolve, reject) => {
            verify(token, this.tokenSecret, (err, decoded) => {
                if (err) {
                    reject(err);
                } else {
                    if (typeof(decoded) === 'object') {
                        resolve((decoded as TokenPayload));
                    }
                }
            })
        })
    }

    private validateAuthenticationDate(date: Date): Promise<void> {
        this.logger.warn('Date', date);
        if (differenceInMinutes(new Date(), date) > 1) {
            return Promise.reject('Authentication date is more than a minute old');
        }
        return Promise.resolve();
    }
    
    private validateAuthenticationHash(request: TelegramTokenRequest): () => Promise<TelegramTokenRequest> {
        return () => {
            return new Promise((resolve, reject) => {
                const { hash, ...properties} = request;
                const authString = sortBy(Object.keys(properties)).map((key) => `${key}=${(<any>request)[key]}`).join("\n");

                const hmac = createHmac('sha256', this.telegramSecret);
                hmac.update(authString);
                const check = hmac.digest('hex');
                this.logger.warn('Hash check', { check, hash: request.hash });
                if (check === request.hash) {
                    resolve(request);
                } else {
                    reject('Hash not matching')
                }
            });
        }
    }
}

export interface TokenSet {
    accessToken: AccessToken,
    refreshToken: RefreshToken | string
}

export interface AccessToken {
    first_name: string, 
    last_name?: string, 
    username?: string, 
    photo_url?: string, 
    language_code: string, 
    typ: 'Bearer' 
}

export interface RefreshToken {
    typ: 'Refresh'
}

export interface TokenPayload {
    sub: string
    [key: string]: string | number | boolean;
}
