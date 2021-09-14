import { route } from 'aurelia';

@route({
  routes: [
    {
      id: 'home',
      path: ['', 'welcome-page'],
      component: import('./welcome-page'),
      title: 'Home',
    },
    {
      id: 'about',
      path: 'about-page',
      component: import('./about-page'),
      title: 'About',
    },
    // { path: 'login', component: import('./auth'), title: 'Sign in' },
    // { path: 'register', component: import('./auth'), title: 'Sign up' }
  ],
})
export class MyApp {
  configureRouter(te: any) {
    console.log(te);
  }
}
