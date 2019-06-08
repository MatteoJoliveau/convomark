/* eslint-disable camelcase */
/* eslint-disable no-param-reassign */

import jwtDecode from 'jwt-decode';
import isAfter from 'date-fns/is_after';

export const STORE_TOKENS = 'store_tokens';
export const STORE_USER = 'store_user';
export const PERFORM_LOGOUT = 'perform_logout';
export const PERFORM_LOGIN = 'perform_login';
export const PERFORM_REFRESH = 'perform_refresh';
export const INITIALIZE_STATE = 'initialize_state';
const USER_STORAGE_KEY = 'user';
const TOKEN_STORAGE_KEY = 'refresh_token';

const initialTokenState = {
  accessToken: '',
  refreshToken: '',
};

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
      localStorage.setItem(TOKEN_STORAGE_KEY, refresh_token);
    },
    [STORE_USER](state, user) {
      state.user = user;
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
    },
    [PERFORM_LOGOUT](state) {
      state.tokens = initialTokenState;
      state.user = undefined;
      localStorage.removeItem(USER_STORAGE_KEY);
      localStorage.removeItem(TOKEN_STORAGE_KEY);
    },
  },
  actions: {
    async [PERFORM_LOGIN]({ commit }, user) {
      const res = await fetch(`${process.env.VUE_APP_API_ENDPOINT}/auth/token`, {
        method: 'post',
        headers: {
          'Content-Type': 'application/json; charset=UTF-8',
        },
        body: JSON.stringify({ ...user, grant_type: 'telegram' }),
      });

      if (res.ok) {
        const tokens = await res.json();
        commit(STORE_USER, user);
        commit(STORE_TOKENS, tokens);
      } else {
        commit(PERFORM_LOGOUT);
        throw new Error(res.statusText);
      }
    },
    async [PERFORM_REFRESH]({ commit }, { user, refresh_token }) {
      const res = await fetch(`${process.env.VUE_APP_API_ENDPOINT}/auth/token`, {
        method: 'post',
        headers: {
          'Content-Type': 'application/json; charset=UTF-8',
        },
        body: JSON.stringify({ grant_type: 'refresh_token', refresh_token }),
      });

      if (res.ok) {
        const tokens = await res.json();
        commit(STORE_USER, user);
        commit(STORE_TOKENS, tokens);
      } else {
        commit(PERFORM_LOGOUT);
        throw new Error(res.statusText);
      }
    },
    [INITIALIZE_STATE]({ commit, dispatch }) {
      const user = localStorage.getItem(USER_STORAGE_KEY);
      const refresh_token = localStorage.getItem(TOKEN_STORAGE_KEY);
      if (user && refresh_token) {
        const { exp } = jwtDecode(refresh_token);
        const expirationDate = new Date(exp * 1000);
        if (isAfter(new Date(), expirationDate)) {
          commit(PERFORM_LOGOUT);
        } else {
          dispatch(PERFORM_REFRESH, { user: JSON.parse(user), refresh_token });
        }
      }
    },
  },
};

export default auth;
