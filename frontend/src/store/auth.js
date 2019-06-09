/* eslint-disable camelcase */
/* eslint-disable no-param-reassign */

import jwtDecode from 'jwt-decode';
import isAfter from 'date-fns/is_after';
import differenceInMilliseconds from 'date-fns/difference_in_milliseconds';
import i18n from '@/i18n';
import { onLogin, onLogout } from '@/apollo';
import { API_ENDPOINT } from '@/constants';

export const STORE_TOKENS = 'store_tokens';
export const STORE_USER = 'store_user';
export const PERFORM_LOGOUT = 'perform_logout';
export const PERFORM_LOGIN = 'perform_login';
export const PERFORM_TOKEN_CALL = 'perform_token_call';
export const PERFORM_REFRESH = 'perform_refresh';
export const REFRESH_TOKEN_STATE = 'initialize_state';
const USER = 'user';
const REFRESH_TOKEN = 'refresh_token';

const initialTokenState = {
  accessToken: '',
  refreshToken: '',
};

function scheduleTokenUpdate({ dispatch, apolloClient, updateIn }) {
  setTimeout(() => {
    dispatch(REFRESH_TOKEN_STATE, { apolloClient })
      .then(() => console.log('Refreshed token state'))
      .catch(() => scheduleTokenUpdate({ dispatch, apolloClient, updateId: (updateIn + 10000) }));
  }, updateIn);
}

const auth = {
  namespaced: true,
  state: {
    authenticated: false,
    tokens: initialTokenState,
    user: undefined,
  },
  getters: {
    accessToken: ({ tokens }) => tokens.accessToken,
    authenticated: ({ authenticated }) => authenticated,
    user: ({ user }) => user,
  },
  mutations: {
    [STORE_TOKENS](state, { access_token, refresh_token }) {
      state.tokens = { accessToken: access_token, refreshToken: refresh_token };
      state.authenticated = true;
      localStorage.setItem(REFRESH_TOKEN, refresh_token);
    },
    [STORE_USER](state, user) {
      state.user = user;
      i18n.locale = user.language_code || i18n.locale;
      localStorage.setItem(USER, JSON.stringify(user));
    },
    [PERFORM_LOGOUT](state) {
      state.tokens = initialTokenState;
      state.user = undefined;
      localStorage.removeItem(USER);
      localStorage.removeItem(REFRESH_TOKEN);
    },
  },
  actions: {
    async [PERFORM_TOKEN_CALL]({ commit, dispatch }, { user, refresh_token, apolloClient }) {
      const payload = refresh_token ? { grant_type: 'refresh_token', refresh_token } : { ...user, grant_type: 'telegram' };
      const body = JSON.stringify(payload);
      const res = await fetch(`${API_ENDPOINT}/auth/token`, {
        method: 'post',
        headers: {
          'Content-Type': 'application/json; charset=UTF-8',
        },
        body,
      });

      if (res.ok) {
        const tokens = await res.json();
        const { access_token } = tokens;
        const { exp } = jwtDecode(access_token);
        const updateIn = differenceInMilliseconds(exp * 1000, Date.now());
        scheduleTokenUpdate({ dispatch, apolloClient, updateIn });
        console.log('Scheduled token update in', updateIn);
        onLogin(apolloClient, access_token);
        commit(STORE_USER, user);
        commit(STORE_TOKENS, tokens);
      } else {
        onLogout(apolloClient);
        commit(PERFORM_LOGOUT);
        throw new Error(res.statusText);
      }
    },
    async [REFRESH_TOKEN_STATE]({ commit, dispatch }, { apolloClient }) {
      const user = localStorage.getItem(USER);
      const refresh_token = localStorage.getItem(REFRESH_TOKEN);
      if (user && refresh_token) {
        const { exp } = jwtDecode(refresh_token);
        const expirationDate = new Date(exp * 1000);
        if (isAfter(new Date(), expirationDate)) {
          commit(PERFORM_LOGOUT);
          onLogout(apolloClient);
        } else {
          const payload = { user: JSON.parse(user), refresh_token, apolloClient };
          await dispatch(PERFORM_TOKEN_CALL, payload);
        }
      }
    },
  },
};

export default auth;
