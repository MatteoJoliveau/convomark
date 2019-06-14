import { Component, Binding } from "@loopback/core";
import { GraphQLController } from "../controllers";
import { GraphQLBindings } from "./keys";
import { resolvers } from "./resolvers";
import { typeDefs } from "./typeDef";

export class GraphQLComponent implements Component {
  controllers = [GraphQLController];

  bindings: Binding[];

  constructor() {
    const resolverBinding = Binding.bind(GraphQLBindings.RESOLVERS).to(resolvers);
    const typesBinding = Binding.bind(GraphQLBindings.TYPE_DEFS).to(typeDefs);

    this.bindings = [resolverBinding, typesBinding];
  }
}
