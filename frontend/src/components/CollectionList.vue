<template>
<div>
  <div v-for="collection in collections" :key="collection.slug">
      <!-- <collection-card :collection="collection" /> -->
  </div>
  </div>
</template>

<script>
import CollectionCard from '@/components/CollectionCard';

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
}
</script>

<style>

</style>
