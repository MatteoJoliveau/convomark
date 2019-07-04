<template>
  <vue-telegram-login
          mode="callback"
          @callback="loginCallback({ user: $event, apolloClient })"
          :telegram-login="telegramBotName"
          requestAccess="write" />
</template>

<script>
import { vueTelegramLogin as VueTelegramLogin } from 'vue-telegram-login';
import { mapActions } from 'vuex';

import { PERFORM_TOKEN_CALL } from '@convomark/commons';
import { BOT_NAME } from '@/constants';

export default {
  name: 'LoginButton',
  components: {
    VueTelegramLogin,
  },
  computed: {
    telegramBotName() {
      return BOT_NAME;
    },
    apolloClient() {
      return this.$apollo.provider.clients.defaultClient;
    },
  },
  methods: {
    ...mapActions({
      loginCallback: `auth/${PERFORM_TOKEN_CALL}`,
    }),
  },
};
</script>

<style>

</style>
