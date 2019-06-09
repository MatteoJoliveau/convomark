<template>
  <div ref="telegram" />
</template>

<script>
export default {
  name: 'telegram-widget',
  props: {
    link: {
      type: String,
      required: true,
    },
  },
  computed: {
    post() {
      return this.link.replace('https://t.me/', '');
    },
  },
  mounted() {
    const script = document.createElement('script');
    script.async = true;
    script.src = 'https://telegram.org/js/telegram-widget.js?6';

    script.setAttribute('data-telegram-post', this.post);
    script.setAttribute('data-width', '100%')

    this.$refs.telegram.appendChild(script);
  }
}
</script>

<style>

</style>
