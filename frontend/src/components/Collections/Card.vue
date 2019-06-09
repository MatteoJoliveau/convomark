<template>
  <div class="card">
    <header class="card-header">
      <router-link class="card-header-title"
        :to="{ name: 'collection', params: { slug: collection.slug }}" >
        {{ collection.title }}
      </router-link>
    </header>
    <div class="card-content">
      <h2 class="subtitle">{{ $t('names.bookmarks') }}: {{ collection.bookmarkCount }}</h2>
    </div>
  </div>
</template>

<script>
export default {
  name: 'collection-card',
  props: {
    collection: {
      type: Object,
      required: true,
    },
  },
};
</script>

<style>

</style>
