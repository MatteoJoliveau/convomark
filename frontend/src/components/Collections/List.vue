<template>
  <div class="container">
    <div class="columns is-multiline" >
      <div class="column"
        v-for="collection in collections"
        :key="collection.slug">
        <collection-card :collection="collection" />
      </div>
    </div>
  </div>
</template>

<script>
import CollectionCard from '@/components/Collections/Card.vue';

export default {
  name: 'collection-list',
  components: {
    CollectionCard,
  },
  props: {
    collections: {
      type: Array,
      default: () => [],
    },
  },
};
</script>

<style>

</style>
