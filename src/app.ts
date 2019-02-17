///<amd-dependency path="bootstrap"/>
import { User } from './models/contracts/users/user';
import { RouterConfiguration, Router, AppRouter, NavModel } from 'aurelia-router';
import { Container } from 'aurelia-dependency-injection';
import * as _ from 'lodash';

export interface ParentNavModel extends NavModel {
  settings: { group: string, children?: ParentNavModel[] };
}
export class App {
  router: Router = null;
  groupedNavigation: ParentNavModel[] = [];
  user: User

  configureRouter(config: RouterConfiguration, router: AppRouter) {
    this.router = router;
    config.title = 'shell:SiteName';

    const childRouter = router.createChild(new Container);
    config.map([
      { route: ['', 'home'], name: 'home', title: 'shell:home', moduleId: 'home/index' },
      { route: 'users', redirect: '', name: 'user', title: 'shell:user', nav: false },
      { route: 'users/create', name: 'createUser', title: 'shell:create', moduleId: 'users/create', nav: false },
      { route: 'users/pay', name: 'pay', title: 'shell:pay', moduleId: 'users/pay', nav: false },
      { route: 'judge', redirect: '', name: 'judge', title: 'shell:judges', nav: true, settings: { group: 'judge', iconClass: 'fa fa-gavel' } },
      { route: 'judges/create', name: 'createJudge', title: 'shell:createJudge', moduleId: 'judges/create', nav: true, settings: { parent: 'judge', iconClass: 'fa fa-plus' } },
      { route: 'challenge', redirect: '', name: 'challenge', title: 'shell:challenges', nav: true, settings: { group: 'challenge', iconClass: 'fa fa-balance-scale' } },
      { route: 'challenges/create', name: 'createChallenge', title: 'shell:createChallenge', moduleId: 'challenges/create', nav: true, settings: { parent: 'challenge', iconClass: 'fa fa-plus' } },
      { route: 'claim', redirect: '', name: 'claim', title: 'shell:claims', nav: true, settings: { group: 'claim', iconClass: 'fa fa-bullhorn' } },
      { route: 'claims/create', name: 'createClaim', title: 'shell:createClaim', moduleId: 'claims/create', nav: true, settings: { parent: 'claim', iconClass: 'fa fa-plus' } },
      { route: 'federation', redirect: '', name: 'federation', title: 'shell:federations', nav: true, settings: { group: 'federation', iconClass: 'fa fa-university' } },
      { route: 'federations/create', name: 'createFederation', title: 'shell:createFederation', moduleId: 'federations/create', nav: true, settings: { parent: 'federation', iconClass: 'fa fa-plus' } },
      { route: 'pending', name: 'pending', title: 'shell:pending', nav: true, moduleId: 'pending/index', settings: { iconClass: 'fa fa-stack-overflow' } }
    ]);

    config.mapUnknownRoutes('not-found');
    router.ensureConfigured().then(() =>
      this.groupedNavigation = this.makeGroupedNavigation()
    );
  }

  private makeGroupedNavigation(): ParentNavModel[] {
    const children = _(this.router.navigation).filter("settings.parent").groupBy("settings.parent").value();
    return <any>_(this.router.navigation).map((nav) => {
      if (!nav.settings || !nav.settings.group) return nav;
      nav.settings.children = children[nav.settings.group];
      return nav;
    }).filter((nav) => nav).reject("settings.parent").value();
  }
}
