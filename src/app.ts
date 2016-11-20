import { RouterConfiguration, Router, AppRouter } from 'aurelia-router';
import { Container } from 'aurelia-dependency-injection';
import { UserRouter } from './users/router';
import { computedFrom } from 'aurelia-framework';
import * as _ from 'lodash';

export class App {
  router: Router = null;
  message = 'Hello World!';
  groupedNavigation: any = [];

  configureRouter(config: RouterConfiguration, router: AppRouter): void {
    this.router = router;
    config.title = 'Aurelia';

    var childRouter = router.createChild(new Container);
    config.map([
      { route: ['', 'home'], name: 'home', title: 'shell:home', moduleId: 'home/index' },
      { route: 'users', name: 'users', title: 'shell:users', moduleId: 'users/index', nav: true, settings: { group: 'users' } },
      { route: 'users/create', name: 'create', title: 'shell:create', moduleId: 'users/create', nav: true, settings: { parent: 'users' } },
      { route: 'users/index', name: 'index', title: 'shell:index', moduleId: 'users/index', nav: true, settings: { parent: 'users' } },
      { route: 'users/:id/detail', name: 'detail', title: 'shell:userDetail', moduleId: 'users/detail' }
    ]);

    config.mapUnknownRoutes('not-found');
    router.ensureConfigured().then(() =>
      this.groupedNavigation = this.makeGroupedNavigation()
    );
  }

  private makeGroupedNavigation() {
    let children = _(this.router.navigation).filter("settings.parent").groupBy("settings.parent").value();
    return _(this.router.navigation).map((nav) => {
      if (!nav.settings || !nav.settings.group) return;
      nav.settings.children = children[nav.settings.group];
      return nav;
    }).filter((nav) => nav).reject("settings.parent").value();
  }
}