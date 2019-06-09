import Vue from 'vue';
import Router from 'vue-router';
import Home from '@/views/Home.vue';

Vue.use(Router);

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home,
    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import(/* webpackChunkName: "about" */ '@/views/About.vue'),
    },
    {
      path: '/login',
      name: 'login',
      component: () => import(/* webpackChunkName: "login" */ '@/views/Login.vue'),
    },
    {
      path: '/collections',
      name: 'collections',
      component: () => import(/* webpackChunkName: "collections" */ '@/views/Collections/List.vue'),
    },
    {
      path: '/collections/:slug',
      name: 'collection',
      component: () => import(/* webpackChunkName: "collection" */ '@/views/Collections/Single.vue'),
      props: true,
    },
    {
      path: '/not-found',
      name: 'not-found',
      component: () => import(/* webpackChunkName: "collection" */ '@/views/NotFound.vue'),
    },
    {
      path: '*',
      redirect: { name: 'not-found' },
    },
  ],
});
