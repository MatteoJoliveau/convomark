import {Request, RestBindings, get, ResponseObject} from '@loopback/rest';
import {inject} from '@loopback/context';
import { repository } from '@loopback/repository';
import { BookmarkRepository, CollectionRepository, UserRepository } from '../repositories';
import { Collection, CollectionWithRelations, User, Bookmark, BookmarkWithRelations, BookmarkCollection } from '../models';
import { BookmarkCollectionRepository } from '../repositories/bookmark-collection.repository';

/**
 * OpenAPI response for ping()
 */
const PING_RESPONSE: ResponseObject = {
  description: 'Ping Response',
  content: {
    'application/json': {
      schema: {
        type: 'object',
        properties: {
          greeting: {type: 'string'},
          date: {type: 'string'},
          url: {type: 'string'},
          headers: {
            type: 'object',
            properties: {
              'Content-Type': {type: 'string'},
            },
            additionalProperties: true,
          },
        },
      },
    },
  },
};

/**
 * A simple controller to bounce back http requests
 */
export class PingController {
  constructor(
    @inject(RestBindings.Http.REQUEST) private req: Request,
    @repository(UserRepository) private userRepo: UserRepository,
    @repository(BookmarkRepository) private bookmarkRepo: BookmarkRepository,
    @repository(CollectionRepository) private collectionRepo: CollectionRepository,
    @repository(BookmarkCollectionRepository) private joinRepo: BookmarkCollectionRepository,
    ) {}

  // Map to `GET /ping`
  @get('/ping', {
    responses: {
      '200': PING_RESPONSE,
    },
  })
  async ping(): Promise<object> {
    const user = await this.userRepo.findOne() as User;
    const collections = await this.userRepo.collections(user.id).find();
    // const bookmarks = await this.collectionRepo.bookmarkCollections(collections[0].id).find()
    //   .then((joins) => Promise.all(joins.map(({ id }) => this.joinRepo.bookmark(id))))
    console.log(user, user.collections, collections);
    // Reply with a greeting, the current time, the url, and request headers
    return {
      greeting: 'Hello from ConvoMark',
      date: new Date(),
      url: this.req.url,
      headers: Object.assign({}, this.req.headers),
    };
  }
}
