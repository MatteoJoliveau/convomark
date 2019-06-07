import { injectable } from "inversify";
import { TelegramTokenRequest } from "src/inversify/interfaces";
import { differenceInMinutes } from 'date-fns';
import { sortBy, filter } from 'lodash';
import {createHmac, createHash, Hmac} from 'crypto';
import { BOT_TOKEN } from "../bot";
import { getLogger } from "../logger";
import { Logger } from "pino";

@injectable()
export class AuthenticationService {
    private readonly logger: Logger;
    private readonly telegramSecret: Buffer;

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