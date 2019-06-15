import { Provider } from "@loopback/context";

import { IResolvers } from "apollo-server";
import { root, user, collection } from "../resolvers";
import { merge } from "lodash";
import { repository } from "@loopback/repository";
import { UserRepository, CollectionRepository } from "../../repositories";

export class ResolversProvider implements Provider<IResolvers<any, any>> {
  constructor(
    @repository(UserRepository) private userRepo: UserRepository,
    @repository(CollectionRepository) private collectionRepo: CollectionRepository,
  ) { }

  value(): IResolvers<any, any> {
    return merge(
      root(),
      user(this.userRepo),
      collection(this.collectionRepo),
    );
  }

}
