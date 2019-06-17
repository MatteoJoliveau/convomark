import { Provider } from "@loopback/context";
import { CrudMiddlewares } from "../types";


export class CollectionsProvider implements Provider<CrudMiddlewares> {
  value(): CrudMiddlewares {
    return {
      create(ctx) {},
      read(ctx) {},
      update(ctx) {},
      delete(ctx) {},
    };
  }
}
