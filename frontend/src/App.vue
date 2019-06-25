<template>
  <div id="app">
    <cookie-law theme="dark-lime" @accept="acceptTracking">
      <div slot="message">
        <p v-html="$t('cookies')"></p>
      </div>
    </cookie-law>
    <navbar />
    <router-view/>
  </div>
</template>

<script>
import CookieLaw from 'vue-cookie-law';
import Navbar from '@/components/Navbar.vue';
import { REFRESH_TOKEN_STATE } from '@/store/auth';
import authenticated from '@/mixins/authenticated';
import userLanguage from '@/apollo/queries/userLanguage.gql';

export default {
  name: 'App',
  components: { CookieLaw, Navbar },
  mixins: [authenticated],
  data() {
    return {
      currentUser: {},
    };
  },
  apollo: {
    currentUser: {
      query: userLanguage,
      result({ data, loading }) {
        if (!loading) {
          const { currentUser: { languageCode } } = data;
          this.$i18n.locale = languageCode;
        }
      },
      skip() {
        return !this.authenticated;
      }
    },
  },
  methods: {
    acceptTracking() {
      this.$matomo.rememberConsentGiven();
    },
  },
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
