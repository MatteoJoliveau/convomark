import store from '@/store';

export default function authenticated(to, from, next) {
  console.log(to);
  console.log(to.matched.some(record => record.meta.public), store.state.auth.authenticated);
  if (store.state.auth.authenticated || to.matched.some(record => record.meta.public)) {
    if (to.query.redirect) {
      console.log('Redirecting to', to.query.redirect);
      next({ path: to.query.redirect, replace: true });
    } else {
      console.log('Proceeding');
      next();
    }
  } else {
    console.log('Redirecting to login');
    next({
      name: 'login',
      query: { redirect: to.fullPath },
    });
  }
}
