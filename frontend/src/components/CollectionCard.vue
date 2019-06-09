<template>
  <div class="card">
    <header class="card-header">
      <p class="card-header-title">{{ collection.title }}</p>
    </header>
  </div>
</template>

<script>
export default {
  name: 'collection-card',
  propos: {
    collection: {
      type: Object,
      required: true,
    },
  },
}
</script>

<style>

</style>
