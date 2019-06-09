<template>
  <div class="container">
    <h1 class="title"> {{ collection.title }}</h1>
    <template v-if="noBookmarks">
      <h3 class="subtitle is-3">{{ $t('collection.noBookmarks.title') }}</h3>
      <p class="content" v-html="$t('collection.noBookmarks.message', { link })"></p>
    </template>
    <div class="columns is-multiline" v-else>
      <div class="column"
        v-for="bookmark in collection.bookmarks"
        :key="bookmark.id" >
        <bookmark-card :bookmark="bookmark" v-on="$listeners"/>
      </div>
    </div>
  </div>
</template>

<script>
import { BOT_LINK } from '@/constants';
import BookmarkCard from '@/components/Bookmarks/Card.vue'

export default {
  name: 'collection',
  components: { BookmarkCard },
  props: {
    collection: {
      type: Object,
      required: true,
    },
  },
  computed: {
    noBookmarks() {
      if (this.collection) {
        return this.collection.bookmarkCount < 1;
      }
      return true;
    },
    link() {
      return BOT_LINK;
    },
  },
};
</script>

<style>

</style>
