///<amd-dependency path="bootstrap"/>
import { RouterConfiguration, Router, AppRouter, NavModel } from 'aurelia-router';
import { Container } from 'aurelia-dependency-injection';
import { computedFrom } from 'aurelia-framework';
import * as _ from 'lodash';

export interface ParentNavModel extends NavModel {
  settings: { children?: ParentNavModel[] }
}
export class App {
  router: Router = null;
  groupedNavigation: ParentNavModel[] = [];

  configureRouter(config: RouterConfiguration, router: AppRouter) {
    this.router = router;
    config.title = 'shell:SiteName';

    var childRouter = router.createChild(new Container);
    config.map([
      { route: ['', 'home'], name: 'home', title: 'shell:home', moduleId: 'home/index' },
      { route: 'users', redirect: '', name: 'user', title: 'shell:user', nav: true, settings: { group: 'users', iconClass: 'fa fa-user' } },
      { route: 'users/index', name: 'index', title: 'shell:users', moduleId: 'users/index', nav: true, settings: { parent: 'users', iconClass: 'fa fa-users' } },
      { route: 'users/create', name: 'create', title: 'shell:create', moduleId: 'users/create', nav: true, settings: { parent: 'users', iconClass: 'fa fa-user-plus' } },
      { route: 'users/:id/detail', name: 'detail', title: 'shell:userDetail', moduleId: 'users/detail' },
      { route: 'pending', name: 'pending', title: 'shell:pending', nav: true, moduleId: 'pending/index', settings: { iconClass: 'fa fa-stack-overflow' } }
    ]);

    config.mapUnknownRoutes('not-found');
    router.ensureConfigured().then(() =>
      this.groupedNavigation = this.makeGroupedNavigation()
    );
  }

  private makeGroupedNavigation(): ParentNavModel[] {
    let children = _(this.router.navigation).filter("settings.parent").groupBy("settings.parent").value();
    return _(this.router.navigation).map((nav) => {
      if (!nav.settings || !nav.settings.group) return nav;
      nav.settings.children = children[nav.settings.group];
      return nav;
    }).filter((nav) => nav).reject("settings.parent").value();
  }
}