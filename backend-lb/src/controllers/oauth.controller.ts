import { post, requestBody, HttpErrors } from "@loopback/rest";
import { UserService } from '@loopback/authentication';
import { TokenRequest } from "../models/token-request.model";
import { inject } from "@loopback/core";
import { TokenServiceBindings, UserServiceBindings, JWTService } from "../authentication";
import { User, TelegramUserLoginData } from "../models";
import { TokenResponse } from "./oauth.controller.response";

// Uncomment these imports to begin using these cool features!

// import {inject} from '@loopback/context';


export class OAuthController {
  constructor(
    @inject(TokenServiceBindings.TOKEN_SERVICE) private tokenService: JWTService,
    @inject(UserServiceBindings.USER_SERVICE) private userService: UserService<User, TelegramUserLoginData>,
    @inject(TokenServiceBindings.ACCESS_TOKEN_EXPIRES_IN) private expiresIn: string
  ) { }

  @post('/oauth/token')
  async token(@requestBody({ required: true }) { grant_type, refresh_token, auth_data }: TokenRequest): Promise<TokenResponse> {
    switch (grant_type) {
      case 'telegram': {
        if (!auth_data) throw new HttpErrors.Unauthorized('auth_data missing');

        const user = await this.userService.verifyCredentials(auth_data);
        const profile = this.userService.convertToUserProfile(user);
        const access_token = await this.tokenService.generateToken(profile, { type: 'Bearer' });
        const refresh_token = await this.tokenService.generateToken(profile, { type: 'Refresh' });
        return {
          access_token,
          token_type: 'Bearer',
          expires_in: Number(this.expiresIn),
          refresh_token
        }
      }
      case 'refresh_token': {
        if (!refresh_token) throw new HttpErrors.Unauthorized('refresh_token missing');

        const profile = await this.tokenService.verifyToken(refresh_token, { type: 'Refresh' });
        const access_token = await this.tokenService.generateToken(profile, { type: 'Bearer' });
        return {
          access_token,
          token_type: 'Bearer',
          expires_in: Number(this.expiresIn),
          refresh_token
        }
      }
      default: throw new HttpErrors.BadRequest('Invalid grant_type');
    }
  }
}
