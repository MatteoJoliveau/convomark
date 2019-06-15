// Copyright IBM Corp. 2019. All Rights Reserved.
// Node module: @loopback/authentication
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

import {inject} from '@loopback/context';
import {HttpErrors} from '@loopback/rest';
import {promisify} from 'util';
import {TokenService, UserProfile} from '@loopback/authentication';
import {TokenServiceBindings} from '../keys';

const jwt = require('jsonwebtoken');
const signAsync = promisify(jwt.sign);
const verifyAsync = promisify(jwt.verify);

export interface TokenOpts {
  type: 'Refresh' | 'Bearer';
}

/**
 * Taken from
 * https://github.com/strongloop/loopback4-example-shopping/blob/master/packages/shopping/src/services/jwt-service.ts
 */
export class JWTService implements TokenService {
  constructor(
    @inject(TokenServiceBindings.TOKEN_SECRET)
    private jwtSecret: string,
    @inject(TokenServiceBindings.ACCESS_TOKEN_EXPIRES_IN)
    private accessExpiresIn: string,
    @inject(TokenServiceBindings.REFRESH_TOKEN_EXPIRES_IN)
    private refreshExpiresIn: string,
    @inject(TokenServiceBindings.TOKEN_AUDIENCE)
    private audience: string,
    @inject(TokenServiceBindings.TOKEN_ISSUER)
    private issuer: string,
  ) {}

  async verifyToken(
    token: string,
    {type}: TokenOpts = {type: 'Bearer'},
  ): Promise<UserProfile> {
    if (!token) {
      throw new HttpErrors.Unauthorized(
        `Error verifying token : 'token' is null`,
      );
    }

    let userProfile: UserProfile;

    try {
      // decode user profile from token
      const decryptedToken = await verifyAsync(token, this.jwtSecret, {
        audience: this.audience,
        issuer: this.issuer,
      });
      if (decryptedToken.typ !== type)
        throw new HttpErrors.Unauthorized('Invalid token type');

      // don't copy over  token field 'iat' and 'exp', nor 'email' to user profile
      userProfile = Object.assign(
        {id: '', name: ''},
        {id: decryptedToken.sub, name: decryptedToken.name},
      );
    } catch (error) {
      throw new HttpErrors.Unauthorized(
        `Error verifying token : ${error.message}`,
      );
    }

    return userProfile;
  }

  async generateToken(
    userProfile: UserProfile,
    {type}: TokenOpts = {type: 'Bearer'},
  ): Promise<string> {
    if (!userProfile) {
      throw new HttpErrors.Unauthorized(
        'Error generating token : userProfile is null',
      );
    }

    // Generate a JSON Web Token
    let token: string;
    try {
      const expiresIn =
        type === 'Refresh'
          ? Number(this.refreshExpiresIn)
          : Number(this.accessExpiresIn);
      const {id: sub, ...profile} = userProfile;
      const payload = {...profile, sub, typ: type};
      token = await signAsync(payload, this.jwtSecret, {
        expiresIn,
        audience: this.audience,
        issuer: this.issuer,
      });
    } catch (error) {
      throw new HttpErrors.Unauthorized(`Error encoding token : ${error}`);
    }

    return token;
  }
}
