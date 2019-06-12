import { api, post, requestBody } from "@loopback/rest";
import { getJsonSchemaRef } from '@loopback/openapi-v3'
import { TokenRequest } from "../models/token-request.model";

// Uncomment these imports to begin using these cool features!

// import {inject} from '@loopback/context';


@api({
  basePath: '/oauth',
  paths: {
    '/token': {
      post: {
        'x-operation-name': 'token',
        requestBody: {
          required: 'true',
          content: {
            'application/json': {
              schema: { 'x-ts-type': TokenRequest }
            }
          }
        }
      }
    }
  }
})
export class OAuthController {
  constructor() { }

  token(@requestBody() body: TokenRequest) {
    console.log('Schema', getJsonSchemaRef(TokenRequest));
    console.log('Hello', body)

  }
}
