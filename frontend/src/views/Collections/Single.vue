<template>
  <section class="section">
    <loading v-if="$apollo.queries.collection.loading" />
    <collection :collection="collection"
      @bookmark-delete="onBookmarkDeleted"
      v-else />
  </section>
</template>

<script>
import bookmarkDelete from '@/apollo/mutations/bookmarkDelete.gql';
import collection from '@/mixins/collection';
import Loading from '@/components/Loading.vue';
import Collection from '@/components/Collections/Single.vue';

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
  watch: {
    collection(updated) {
      if (!updated) {
        this.$router.replace({ name: 'not-found' });
      }
    }
  },
  methods: {
    onBookmarkDeleted({ id }) {
      this.$apollo.mutate({
        mutation: bookmarkDelete,
        variables: {
          id
        },
      });
    }
  }
}
</script>

<style>

</style>
