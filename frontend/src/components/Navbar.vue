<template>
  <nav class="navbar" role="navigation" aria-label="main navigation">
  <div class="navbar-brand">
     <router-link class="navbar-item" :to="{ name: 'home' }">
        <img src="@/assets/logo.png" height="80">
    </router-link>

    <a role="button" class="navbar-burger burger" aria-label="menu" aria-expanded="false" @click="toggleMenu">
      <span aria-hidden="true"></span>
      <span aria-hidden="true"></span>
      <span aria-hidden="true"></span>
    </a>
  </div>

  <div class="navbar-menu" :class="{ 'is-active': menuActive }">
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
        <login-button class="navbar-item"/>
    </div>
  </div>
</nav>
</template>

<script>
import LoginButton from '@/components/LoginButton';

export default {
  name: 'Navbar',
  data() {
    return {
      menuActive: false,
    };
  },
  components: {
    LoginButton,
  },
  methods: {
    toggleMenu() {
      this.menuActive = !this.menuActive;
    },
  },
};
</script>

<style>

</style>
