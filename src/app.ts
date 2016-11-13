import { RouterConfiguration, Router } from 'aurelia-router';

export class App {
  router: Router;
  message = 'Hello World!';

  configureRouter(config: RouterConfiguration, router: Router): void {
    this.router = router;
    config.title = 'Aurelia';
    config.map([
      { route: ['', 'home'], name: 'home', moduleId: 'home/index' },
      { route: 'users', name: 'users', moduleId: 'users/index', nav: true, caseSensitive: true },
      { route: 'users/:id/detail', name: 'userDetail', moduleId: 'users/detail' }
    ]);

    config.mapUnknownRoutes('not-found');
  }
}