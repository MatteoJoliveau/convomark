<template>
  <article class="message is-info">
    <div class="message-header">
      <p v-if="bookmark.name">{{ bookmark.name }}</p>
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
  computed: {
    messageHeader() {
      if (this.bookmark.name) {
        return `${this.bookmark.name} - ${this.bookmark.messageLink}`;
      }
      return this.bookmark.messageLink;
    },
  },
};
</script>
