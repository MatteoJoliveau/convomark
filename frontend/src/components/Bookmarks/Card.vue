<template>
  <article class="message is-info">
    <div class="message-header">
      <a :href="bookmark.messageLink" target="_blank">{{ bookmark.messageLink }}</a>
      <button class="delete" @click="$emit('bookmark-delete', bookmark)"></button>
    </div>
    <div class="message-body">
      <telegram-widget :link="bookmark.messageLink"/>
    </div>
  </article>
</template>

<script>
import TelegramWidget from '@/components/TelegramWidget.vue';

export default {
  name: 'bookmark-card',
  components: { TelegramWidget },
  props: {
    bookmark: {
      type: Object,
      required: true,
    },
  },
};
</script>
