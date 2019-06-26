<template>
  <section class="section">
    <h1 class="title">{{ $t('names.collections') }}</h1>
    <loading v-if="$apollo.queries.collections.loading" />
    <collection-list :collections="collections" v-else />
  </section>
</template>

<script>
import collections from '@/mixins/collections';
import Loading from '@/components/Loading.vue';
import CollectionList from '@/components/Collections/List.vue';

export default {
  name: 'collection-list-view',
  components: { CollectionList, Loading },
  mixins: [collections],
};
</script>

<style>

</style>
