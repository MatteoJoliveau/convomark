/* eslint-disable @typescript-eslint/camelcase */

import {post, requestBody, HttpErrors} from '@loopback/rest';
import {UserService} from '@loopback/authentication';
import {TokenRequest, TelegramUserLoginData} from '../models';
import {inject} from '@loopback/core';
import {
  TokenServiceBindings,
  UserServiceBindings,
  JWTService,
} from '../authentication';
import {User} from '../entities';
import {TokenResponse} from './oauth.controller.response';

// Uncomment these imports to begin using these cool features!

// import {inject} from '@loopback/context';

export class OAuthController {
  constructor(
    @inject(TokenServiceBindings.TOKEN_SERVICE)
    private tokenService: JWTService,
    @inject(UserServiceBindings.USER_SERVICE)
    private userService: UserService<User, TelegramUserLoginData>,
    @inject(TokenServiceBindings.ACCESS_TOKEN_EXPIRES_IN)
    private expiresIn: string,
  ) {}

  @post('/oauth/token', {
    responses: {
      '200': {
        content: {
          'application/json': {
            schema: {
              title: 'Token Response',
              type: 'object',
              properties: {
                access_token: {
                  type: 'string',
                },
                token_type: {
                  type: 'string',
                },
                expires_in: {
                  type: 'number',
                },
                refresh_token: {
                  type: 'string',
                },
              },
            },
          },
        },
      },
    },
  })
  async token(@requestBody({required: true})
  {
    grant_type: grantType,
    refresh_token: refreshToken,
    auth_data: authData,
  }: TokenRequest): Promise<TokenResponse> {
    switch (grantType) {
      case 'telegram': {
        if (!authData) throw new HttpErrors.Unauthorized('auth_data missing');

        const user = await this.userService.verifyCredentials(authData);
        const profile = this.userService.convertToUserProfile(user);
        const access_token = await this.tokenService.generateToken(profile, {
          type: 'Bearer',
        });
        const refresh_token = await this.tokenService.generateToken(profile, {
          type: 'Refresh',
        });
        return {
          access_token,
          token_type: 'Bearer',
          expires_in: Number(this.expiresIn),
          refresh_token,
        };
      }
      case 'refresh_token': {
        if (!refreshToken)
          throw new HttpErrors.Unauthorized('refresh_token missing');

        const profile = await this.tokenService.verifyToken(refreshToken, {
          type: 'Refresh',
        });
        const access_token = await this.tokenService.generateToken(profile, {
          type: 'Bearer',
        });
        return {
          access_token,
          token_type: 'Bearer',
          expires_in: Number(this.expiresIn),
          refresh_token: refreshToken,
        };
      }
      default:
        throw new HttpErrors.BadRequest('Invalid grant_type');
    }
  }
}
