import {User} from '../entities';

export interface ApplicationApolloContext {
  currentUser?: User;
}
