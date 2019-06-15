import { Component, Binding } from "@loopback/core";
import { GraphQLController } from "./controllers";
import { GraphQLBindings } from "./keys";
import { typeDefs } from "./typeDef";
import { ServerProvider } from "./providers";
import { ResolversProvider } from "./providers/resolvers.provider";

export class GraphQLComponent implements Component {
  providers = {
    [GraphQLBindings.SERVER.key]: ServerProvider,
    [GraphQLBindings.RESOLVERS.key]: ResolversProvider,
  }

  controllers = [GraphQLController];

  bindings: Binding[];

  constructor() {
    const typesBinding = Binding.bind(GraphQLBindings.TYPE_DEFS).to(typeDefs);

    this.bindings = [typesBinding];
  }
}
