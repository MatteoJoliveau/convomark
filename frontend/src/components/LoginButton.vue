<template>
  <div v-if="authenticated" class="level">
    <p class="level-item">{{ user.username || user.first_name }}</p>
    <figure class="level-item image">
      <img :src="user.photo_url" class="is-rounded" />
    </figure>
  </div>
  <vue-telegram-login
          v-else
          mode="callback"
          @callback="loginCallback"
          :telegram-login="telegramBotName"
          requestAccess="write" />
</template>

<script>
import { vueTelegramLogin as VueTelegramLogin } from 'vue-telegram-login';
import { mapActions, mapGetters } from 'vuex';

import { PERFORM_LOGIN } from '@/store/auth';

export default {
  name: 'LoginButton',
   components: {
    VueTelegramLogin,
  },
  computed: {
    ...mapGetters({
      authenticated: 'auth/authenticated',
      user: 'auth/user',
    }),
    telegramBotName() {
      return process.env.VUE_APP_TELEGRAM_BOT_NAME;
    },
  },
  methods: {
    ...mapActions({
      loginCallback: `auth/${PERFORM_LOGIN}`,
      }),
  },
}
</script>

<style>

</style>
