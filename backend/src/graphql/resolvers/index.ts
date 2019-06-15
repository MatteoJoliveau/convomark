import { merge } from 'lodash';
import { root } from './root';
import { IResolvers } from 'apollo-server';

export const resolvers: IResolvers<any, any> = merge(root);

export * from './root';
export * from './user';
export * from './collection';
