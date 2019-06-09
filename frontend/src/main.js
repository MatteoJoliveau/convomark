import 'vuetify/dist/vuetify.min.css';
import 'roboto-fontface/css/roboto/roboto-fontface.css';
import '@mdi/font/css/materialdesignicons.css';
import './plugins/vuetify';

import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import './assets/application.scss';
import './registerServiceWorker';
import { createProvider } from './apollo';
import i18n from './i18n';

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  apolloProvider: createProvider(),
  i18n,
  render: h => h(App),
}).$mount('#app');
