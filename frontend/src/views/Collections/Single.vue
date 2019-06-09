<template>
  <section class="section">
    <loading v-if="$apollo.queries.collection.loading" />
    <collection :collection="collection" v-else />
  </section>
</template>

<script>
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
}
</script>

<style>

</style>
