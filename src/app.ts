import { RouterConfiguration, Router, AppRouter } from 'aurelia-router';
import { Container } from 'aurelia-dependency-injection';
import { UserRouter } from './users/router';

export class App {
  router: Router;
  message = 'Hello World!';

  configureRouter(config: RouterConfiguration, router: AppRouter): void {
    this.router = router;
    config.title = 'Aurelia';

    var childRouter = router.createChild(new Container);
    config.map([
      { route: ['', 'home'], name: 'home', title: 'shell:home', moduleId: 'home/index' },
      { route: 'users', name: 'usersrouter', moduleId: './users/router', nav: true, title: 'Users', settings: { childRouter: childRouter } }
    ]);

    childRouter.configure((config) => {
      UserRouter.configureRouter(config, childRouter)
      return config;
    });

    config.mapUnknownRoutes('not-found');
  }
}