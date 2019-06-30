import {ApolloServer, IResolvers} from 'apollo-server';
import {inject, Provider} from '@loopback/context';
import {GraphQLBindings} from '../keys';
import {DocumentNode} from 'graphql';
import {AuthenticationBindings, UserProfile} from '@loopback/authentication';
import {TypeORMBindings, UserRepository} from '../../typeorm';

export class ServerProvider implements Provider<ApolloServer> {
  constructor(
    @inject(GraphQLBindings.RESOLVERS)
    private resolvers: IResolvers<object, object>,
    @inject(GraphQLBindings.TYPE_DEFS) private typeDefs: DocumentNode,
    @inject(AuthenticationBindings.CURRENT_USER)
    private currentUser: UserProfile,
    @inject(TypeORMBindings.USER_REPOSITORY) private userRepo: UserRepository,
  ) {}

  async value(): Promise<ApolloServer> {
    const currentUser = await this.userRepo.findOne(+this.currentUser.id);

    return new ApolloServer({
      resolvers: this.resolvers,
      typeDefs: this.typeDefs,
      context: () => ({currentUser}),
    });
  }
}
