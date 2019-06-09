<template>
  <section class="section">
    <v-snackbar
        v-model="notifications.deleted"
        color="success"
        top>
      Deleted!
      <v-btn
        @click="notifications.deleted = false"
        flat>
        Close
      </v-btn>
    </v-snackbar>
    <v-alert v-model="notifications.failed"
      color="error"
      transition="slide-y-transition"
      dismissible>
      Failed to delete!
    </v-alert>
    <loading v-if="$apollo.queries.collection.loading" />
    <collection :collection="collection"
      @bookmark-delete="onBookmarkDeleted"
      v-else-if="collection" />
  </section>
</template>

<script>
import bookmarkDelete from '@/apollo/mutations/bookmarkDelete.gql';
import userCollection from '@/apollo/queries/userCollection.gql';
import collection from '@/mixins/collection';
import Loading from '@/components/Loading.vue';
import Collection from '@/components/Collections/Single.vue';
import { VAlert, VSnackbar, VBtn } from 'vuetify/lib';
import remove from 'lodash/remove';

export default {
  name: 'collection-single-view',
  components: { Collection, Loading, VAlert, VSnackbar, VBtn },
  mixins: [collection],
  props: {
    slug: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      notifications: {
        deleted: false,
        failed: false,
      }
    };
  },
  watch: {
    collection(updated) {
      if (!updated) {
        this.$router.replace({ name: 'not-found' });
      }
    }
  },
  methods: {
    onBookmarkDeleted({ id }) {
      this.notifications.deleted = false;
      this.notifications.failed = false;

      this.$apollo.mutate({
        mutation: bookmarkDelete,
        variables: {
          id
        },
        update: (store, { data: { bookmarkDelete } }) => {
          const variables = {
              slug: this.slug,
          };
          const data = store.readQuery({
            query: userCollection,
            variables
          });

          const predicate =  (bookmark) => bookmark.id === id;
          remove(data.currentUser.collection.bookmarks, predicate);
          data.currentUser.collection.bookmarkCount -= 1;
          store.writeQuery({ query: userCollection, variables, data});
        },
      })
      .then(() => this.notifications.deleted = true)
      .catch(() => {
        this.notifications.failed = true
      });
    }
  },
}
</script>

<style>

</style>
