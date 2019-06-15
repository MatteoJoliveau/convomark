import { BindingKey } from "@loopback/core";
import { DocumentNode } from 'graphql';
import { IResolvers } from "apollo-server";
import { ApolloServer } from "apollo-server";

export namespace GraphQLBindings {
  export const RESOLVERS = BindingKey.create<IResolvers<any, any>>('graphql.resolvers');
  export const TYPE_DEFS = BindingKey.create<DocumentNode>('graphql.typedefs');
  export const SERVER = BindingKey.create<ApolloServer>('graphql.server');
}
