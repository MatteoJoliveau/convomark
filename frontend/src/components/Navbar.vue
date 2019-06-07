<template>
  <nav class="navbar" role="navigation" aria-label="main navigation">
  <div class="navbar-brand">
     <router-link class="navbar-item" :to="{ name: 'home' }">
        <img src="@/assets/logo.png" height="80">
    </router-link>

    <a role="button" class="navbar-burger burger" aria-label="menu" aria-expanded="false" data-target="navbarBasicExample">
      <span aria-hidden="true"></span>
      <span aria-hidden="true"></span>
      <span aria-hidden="true"></span>
    </a>
  </div>

  <div class="navbar-menu">
    <div class="navbar-start">
      <div class="navbar-item has-dropdown is-hoverable">
        <a class="navbar-link">
          Collections
        </a>

        <div class="navbar-dropdown">
          <a class="navbar-item">
            Default
          </a>
          <a class="navbar-item">
            Technology
          </a>
          <a class="navbar-item">
            Memes
          </a>
        </div>
      </div>
      <a class="navbar-item">
        Bot
      </a>
      <router-link class="navbar-item" :to="{ name: 'about' }">About</router-link>
    </div>

    <div class="navbar-end">
      <div class="navbar-item">
        <vue-telegram-login
          mode="callback"
          @callback="handleTelegramCallback"
          telegram-login="Codexgametestbot"
          requestAccess="write" />
      </div>
    </div>
  </div>
</nav>
</template>

<script>
import { vueTelegramLogin as VueTelegramLogin } from 'vue-telegram-login';

export default {
  name: 'Navbar',
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

<style>

</style>
