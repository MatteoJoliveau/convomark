import Vue from 'vue';
import Buefy from 'buefy';
import App from './App.vue';
import router from './router';
import store from './store';
import './assets/application.scss';
import './registerServiceWorker';
import { createProvider } from './apollo';
import i18n from './i18n';

Vue.config.productionTip = false;

Vue.use(Buefy);

new Vue({
  router,
  store,
  apolloProvider: createProvider(),
  i18n,
  render: h => h(App),
}).$mount('#app');
