import { ApolloServer, IResolvers } from "apollo-server";
import { Provider, inject } from "@loopback/context";
import { GraphQLBindings } from "../keys";
import { DocumentNode } from "graphql";
import { AuthenticationBindings, UserProfile } from "@loopback/authentication";
import { repository } from "@loopback/repository";
import { UserRepository } from "../../repositories";

export class ServerProvider implements Provider<ApolloServer> {
  constructor(
    @inject(GraphQLBindings.RESOLVERS) private resolvers: IResolvers<any, any>,
    @inject(GraphQLBindings.TYPE_DEFS) private typeDefs: DocumentNode,
    @inject(AuthenticationBindings.CURRENT_USER) private currentUser: UserProfile,
    @repository(UserRepository) private userRepo: UserRepository
  ) {}

  async value(): Promise<ApolloServer> {
    const currentUser = await this.userRepo.findById(Number(this.currentUser.id));

    return new ApolloServer({
      resolvers: this.resolvers,
      typeDefs: this.typeDefs,
        context: () => ({ currentUser }),
    });
  }

}
