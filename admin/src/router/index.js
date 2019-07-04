import Vue from 'vue';
import Router from 'vue-router';
import DashboardLayout from '@/layout/DashboardLayout.vue';
import AuthLayout from '@/layout/AuthLayout.vue';
import authenticated from './guards';

Vue.use(Router);

const router = new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  linkExactActiveClass: 'active',
  routes: [
    {
      path: '/',
      redirect: 'dashboard',
      component: DashboardLayout,
      children: [
        {
          path: '/dashboard',
          name: 'dashboard',
          // route level code-splitting
          // this generates a separate chunk (about.[hash].js) for this route
          // which is lazy-loaded when the route is visited.
          component: () => import(/* webpackChunkName: "demo" */ '../views/Dashboard.vue'),
        },
        {
          path: '/icons',
          name: 'icons',
          component: () => import(/* webpackChunkName: "demo" */ '../views/Icons.vue'),
        },
        {
          path: '/profile',
          name: 'profile',
          component: () => import(/* webpackChunkName: "demo" */ '../views/UserProfile.vue'),
        },
        {
          path: '/maps',
          name: 'maps',
          component: () => import(/* webpackChunkName: "demo" */ '../views/Maps.vue'),
        },
        {
          path: '/tables',
          name: 'tables',
          component: () => import(/* webpackChunkName: "demo" */ '../views/Tables.vue'),
        },
      ],
    },
    {
      path: '/',
      redirect: 'login',
      component: AuthLayout,
      meta: { public: true },
      children: [
        {
          path: '/login',
          name: 'login',
          meta: { public: true },
          component: () => import(/* webpackChunkName: "demo" */ '../views/Login.vue'),
        },
      ],
    },
  ],
});

router.beforeEach(authenticated);

export default router;
