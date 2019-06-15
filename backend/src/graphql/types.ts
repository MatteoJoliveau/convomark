import {User} from '../models';

export interface ApplicationApolloContext {
  currentUser?: User;
}
