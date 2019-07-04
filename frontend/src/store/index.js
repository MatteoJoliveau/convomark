/* eslint-disable no-param-reassign */

import Vue from 'vue';
import Vuex from 'vuex';
import { createAuthModule } from '@convomark/commons/vuex';
import { onLogin, onLogout } from '@/apollo';
import { API_ENDPOINT as apiEndpoint } from '../constants';

Vue.use(Vuex);

const auth = createAuthModule({ onLogin, onLogout, apiEndpoint });
export default new Vuex.Store({
  modules: {
    auth,
  },
  state: {},
  mutations: {},
  actions: {},
});
