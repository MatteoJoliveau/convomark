<template>
  <section class="section">
    <loading v-if="$apollo.queries.collection.loading"/>
    <collection
      :collection="collection"
      @bookmark-delete="onBookmarkDeleted"
      v-else-if="collection"
    />
  </section>
</template>

<script>
import bookmarkDelete from '@/apollo/mutations/bookmarkDelete.gql';
import userCollection from '@/apollo/queries/userCollection.gql';
import collection from '@/mixins/collection';
import Loading from '@/components/Loading.vue';
import Collection from '@/components/Collections/Single.vue';
import remove from 'lodash/remove';

export default {
  name: 'collection-single-view',
  components: { Collection, Loading },
  mixins: [collection],
  props: {
    slug: {
      type: String,
      required: true,
    },
  },
  data() {
    return {};
  },
  watch: {
    collection(updated) {
      if (!updated) {
        this.$router.replace({ name: 'not-found' });
      }
    },
  },
  methods: {
    onBookmarkDeleted({ id }) {
      this.$apollo
        .mutate({
          mutation: bookmarkDelete,
          variables: {
            id,
          },
          update: (store, { data: { bookmarkDelete } }) => {
            const variables = {
              slug: this.slug,
            };
            const data = store.readQuery({
              query: userCollection,
              variables,
            });

            const predicate = bookmark => bookmark.id === id;
            remove(data.currentUser.collection.bookmarks, predicate);
            data.currentUser.collection.bookmarkCount -= 1;
            store.writeQuery({ query: userCollection, variables, data });
          },
        })
        .then(() => this.$notification.open({
          message: this.$t('alerts.deleted', { object: 'Bookmark' }),
          type: 'is-success',
          hasIcon: true,
        }))
        .catch((e) => {
          this.$notification.open({
            message: this.$t('alerts.error'),
            type: 'is-danger',
            hasIcon: true,
          });
          console.error(e);
        });
    },
  },
};
</script>

<style>
</style>
