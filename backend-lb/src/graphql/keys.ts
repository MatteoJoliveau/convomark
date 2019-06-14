import { BindingKey } from "@loopback/core";
import { DocumentNode } from 'graphql';
import { IResolvers } from "apollo-server";

export namespace GraphQLBindings {
  export const RESOLVERS = BindingKey.create<IResolvers<any, any>>('graphql.resolvers');
  export const TYPE_DEFS = BindingKey.create<DocumentNode>('graphql.typedefs');
}
