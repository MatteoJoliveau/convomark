<template>
  <nav class="navbar" role="navigation" aria-label="main navigation">
  <div class="navbar-brand">
     <router-link class="navbar-item" :to="{ name: 'home' }">
        <img src="@/assets/logo.png" height="80">
    </router-link>

    <a role="button"
      class="navbar-burger burger"
      aria-label="menu"
      aria-expanded="false"
      @click="toggleMenu">
      <span aria-hidden="true"></span>
      <span aria-hidden="true"></span>
      <span aria-hidden="true"></span>
    </a>
  </div>

  <div class="navbar-menu" :class="{ 'is-active': menuActive }">
    <div class="navbar-start">
      <div class="navbar-item has-dropdown is-hoverable" v-if="anyCollection">
        <router-link class="navbar-link" :to="{ name: 'collections' }">
          Collections
        </router-link>

        <div class="navbar-dropdown">
          <router-link v-for="collection in collections"
            :key="collection.slug"
            :to="{ name: 'collection', params: { slug: collection.slug } }"
            class="navbar-item">
            {{ collection.title }}
          </router-link>
        </div>
      </div>
      <a class="navbar-item" :href="botLink" target="_blank">
        Bot
      </a>
      <router-link class="navbar-item" :to="{ name: 'about' }">About</router-link>
      <router-link class="navbar-item" :to="{ name: 'privacy' }">Privacy</router-link>
    </div>

    <div class="navbar-end">
      <div v-if="authenticated" class="navbar-item">
        <p class="level-item">{{ user.username || user.first_name }}</p>
      </div>
        <login-button class="navbar-item" v-else />
    </div>
  </div>
</nav>
</template>

<script>
import { mapGetters } from 'vuex';
import LoginButton from '@/components/LoginButton.vue';
import collections from '@/mixins/collections';
import { BOT_NAME } from '@/constants';

export default {
  name: 'Navbar',
  components: {
    LoginButton,
  },
  mixins: [collections],
  data() {
    return {
      menuActive: false,
    };
  },
  computed: {
    ...mapGetters({
      authenticated: 'auth/authenticated',
      user: 'auth/user',
    }),
    botLink() {
      return `https://telegram.me/${BOT_NAME}?start`;
    },
  },
  methods: {
    toggleMenu() {
      this.menuActive = !this.menuActive;
    },
  },
  created() {
    this.$router.beforeResolve((_to, _from, next) => {
      this.menuActive = false;
      next();
    });
  },
};
</script>

<style>

</style>
