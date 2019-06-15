import {post, requestBody, RestBindings, Response} from '@loopback/rest';
import {Loggable, Logger, logger} from '../../logging';
import {ApolloServer} from 'apollo-server';
import {GraphQLRequest} from 'apollo-server-core';
import {GraphQLBindings} from '../keys';
import {inject} from '@loopback/context';
import {
  authenticate,
  UserProfile,
  AuthenticationBindings,
} from '@loopback/authentication';

@logger()
export class GraphQLController implements Loggable {
  logger: Logger;
  constructor(
    @inject(GraphQLBindings.SERVER) private server: ApolloServer,
    @inject(RestBindings.Http.RESPONSE) private response: Response,
    @inject(AuthenticationBindings.CURRENT_USER)
    private currentUser: UserProfile,
  ) {}

  @authenticate('TokenStrategy')
  @post('/graphql')
  async graphql(@requestBody() request: GraphQLRequest) {
    this.logger.debug('Handling GraphQL request', {
      request,
      currentUser: this.currentUser,
    });

    const {http, ...res} = await this.server.executeOperation(request);
    if (http && http.status) {
      this.logger.debug('Sending response', {status: http.status});
      this.response.status(http.status);
      for (const [header, value] of http.headers) {
        this.response.header(header, value);
      }
    }
    this.response.json(res);
  }
}
