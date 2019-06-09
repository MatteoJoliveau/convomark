<template>
      <telegram-widget :link="bookmark.messageLink"/>
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
