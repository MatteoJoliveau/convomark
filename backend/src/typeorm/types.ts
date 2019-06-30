import {Repository} from 'typeorm';
import {Collection, User, Bookmark} from '../models';

export type UserRepository = Repository<User>;
export type CollectionRepository = Repository<Collection>;
export type BookmarkRepository = Repository<Bookmark>;
