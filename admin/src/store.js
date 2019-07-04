import Vue from 'vue';
import Vuex from 'vuex';
import { createAuthModule } from '@convomark/commons/vuex';

Vue.use(Vuex);

const auth = createAuthModule({});
export default new Vuex.Store({
  modules: { auth },
  state: {

  },
  mutations: {

  },
  actions: {

  },
});
