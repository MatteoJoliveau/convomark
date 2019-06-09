<template>
  <div id="app">
    <navbar />
    <router-view/>
  </div>
</template>

<script>
import Navbar from '@/components/Navbar.vue';
import { REFRESH_TOKEN_STATE } from '@/store/auth';

export default {
  name: 'App',
  components: { Navbar },
  created() {
    this.$store.dispatch(`auth/${REFRESH_TOKEN_STATE}`, { apolloClient: this.$apollo.provider.clients.defaultClient });
  },
};
</script>


<style lang="scss">
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
#nav {
  padding: 30px;
  a {
    font-weight: bold;
    color: #2c3e50;
    &.router-link-exact-active {
      color: #42b983;
    }
  }
}
</style>
