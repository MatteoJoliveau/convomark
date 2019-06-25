import Vue from 'vue';
import Buefy from 'buefy';
import Matomo from 'vue-matomo';
import App from './App.vue';
import router from './router';
import store from './store';
import './assets/application.scss';
import './registerServiceWorker';
import { createProvider } from './apollo';
import i18n from './i18n';

Vue.config.productionTip = false;

Vue.use(Buefy);

Vue.use(Matomo, {
  host: process.env.VUE_APP_MATOMO_HOST,
  siteId: 1,
  trackerFileName: 'matomo',
  router,
  enableLinkTracking: true,
  requireConsent: true,
  debug: process.env.CONTEXT !== 'production',
});


new Vue({
  router,
  store,
  apolloProvider: createProvider(),
  i18n,
  render: h => h(App),
}).$mount('#app');
