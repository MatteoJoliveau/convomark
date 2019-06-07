<template>
  <div class="home">
    <vue-telegram-login
      mode="callback"
      @callback="handleTelegramCallback"
      telegram-login="Codexgametestbot"
      requestAccess="write" />


  </div>
</template>

<script>
// @ is an alias to /src
import { vueTelegramLogin as VueTelegramLogin } from 'vue-telegram-login';

export default {
  name: 'home',
  components: {
    VueTelegramLogin,
  },
  methods: {
    async handleTelegramCallback(user) {
      const res = await fetch(`${process.env.VUE_APP_API_ENDPOINT}/auth/token`, {
        method: 'post',
        headers: {
          'Content-Type': 'application/json; charset=UTF-8',
        },
        body: JSON.stringify(user),
      });

      const { access_token, refresh_token } = await res.json();
      localStorage.setItem('refres_token', refresh_token);
    },
  },
};
</script>
