import userCollection from '@/apollo/queries/userCollection.gql';
import authenticated from './authenticated';

export default {
  mixins: [authenticated],
  apollo: {
    collection: {
      query: userCollection,
      variables() {
        return {
          slug: this.slug,
        };
      },
      skip() {
        return !this.authenticated;
      },
      update({ currentUser }) {
        return currentUser.collection;
      },
    },
  },
  data() {
    return {
      collection: {
        bookmarks: [],
      },
    };
  },
};
