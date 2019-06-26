<template>
  <section class="section">
    <h1 class="title">ConvoMark</h1>
    <collection-list :collections="collections" v-if="authenticated" />
    <div class="container" v-else>
      <div class="columns is-desktop">
        <div class="column">
          <h2 class="subtitle is-2">{{ $t('pages.home.title') }}</h2>
          <p class="content" v-html="$t('pages.home.body')"></p>
          <figure class="image is-800x800 logo">
            <img src="@/assets/logo.png" height="600">
          </figure>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import collections from '@/mixins/collections';
import CollectionList from '@/components/Collections/List.vue';

export default {
  name: 'home',
  components: { CollectionList },
  mixins: [collections],
};
</script>

<style>
  .logo {
    margin: auto;
  }
</style>
