///<amd-dependency path="bootstrap"/>
import { RouterConfiguration, Router, AppRouter, NavModel } from 'aurelia-router';
import { Container } from 'aurelia-dependency-injection';
import { computedFrom } from 'aurelia-framework';
import * as _ from 'lodash';

export interface ParentNavModel extends NavModel {
  settings: { group: string, children?: ParentNavModel[] }
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
      { route: 'users/create', name: 'create', title: 'shell:create', moduleId: 'users/create', nav: true, settings: { parent: 'users', iconClass: 'fa fa-plus' } },
      { route: 'judge', redirect: '', name: 'user', title: 'shell:judges', nav: true, settings: { group: 'judge', iconClass: 'fa fa-gavel' } },
      { route: 'judges/create', name: 'create', title: 'shell:createJudge', moduleId: 'judges/create', nav: true, settings: { parent: 'judge', iconClass: 'fa fa-plus' } },
      { route: 'claim', redirect: '', name: 'user', title: 'shell:claims', nav: true, settings: { group: 'claim', iconClass: 'fa fa-bullhorn' } },
      { route: 'claims/create', name: 'create', title: 'shell:createClaim', moduleId: 'claims/create', nav: true, settings: { parent: 'claim', iconClass: 'fa fa-plus' } },
      { route: 'challenge', redirect: '', name: 'user', title: 'shell:challenges', nav: true, settings: { group: 'challenge', iconClass: 'fa fa-balance-scale' } },
      { route: 'challenges/create', name: 'create', title: 'shell:createChallenge', moduleId: 'challenges/create', nav: true, settings: { parent: 'challenge', iconClass: 'fa fa-plus' } },
      { route: 'citation', redirect: '', name: 'user', title: 'shell:citations', nav: true, settings: { group: 'citation', iconClass: 'fa fa-link' } },
      { route: 'citations/create', name: 'create', title: 'shell:createCitation', moduleId: 'citations/create', nav: true, settings: { parent: 'citation', iconClass: 'fa fa-plus' } },
      { route: 'federation', redirect: '', name: 'user', title: 'shell:federations', nav: true, settings: { group: 'federation', iconClass: 'fa fa-university' } },
      { route: 'federations/create', name: 'create', title: 'shell:createFederation', moduleId: 'federations/create', nav: true, settings: { parent: 'federation', iconClass: 'fa fa-plus' } },
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
    }).filter((nav) => <any>nav).reject("settings.parent").value();
  }
}