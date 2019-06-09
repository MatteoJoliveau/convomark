import { mapGetters } from 'vuex';
import userCollections from '@/apollo/queries/userCollections.gql';

export default {
  apollo: {
    collections: {
      query: userCollections,
      skip() {
        return !this.authenticated;
      },
      update({ currentUser }) {
        return currentUser.collections;
      },
    },
  },
  data() {
    return {
      collections: [],
    };
  },
  computed: {
    ...mapGetters({
      authenticated: 'auth/authenticated',
    }),
    anyCollection() {
      return this.collections.length > 0;
    },
  },
};
