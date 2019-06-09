<template>
  <div class="home">
    <figure class="image">
      <img alt="ConvoMark logo" src="@/assets/banner-large.png">
    </figure>
    <collection-list :collections="collections"/>
  </div>
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
