///<amd-dependency path="bootstrap"/>
import { CurrentUser } from './users/current';
import { RouterConfiguration, Router, AppRouter, NavModel } from 'aurelia-router';
import * as _ from 'lodash';
import { computedFrom } from 'aurelia-binding';
import { Nav } from './resources/elements/nav-bar';

export class App {
  public navtype: Nav;
  router: Router = null;
  currentUser = CurrentUser;

  @computedFrom("currentUser.decryptedUser")
  public get user() {
    return this.currentUser.decryptedUser && this.currentUser.decryptedUser.setup;
  }

  configureRouter(config: RouterConfiguration, router: AppRouter) {
    this.router = router;
    config.title = 'shell:SiteName';

    config.map([
      {
        route: ['', 'home'],
        name: 'home',
        title: 'shell:home',
        moduleId: 'home/index'
      }, {
        route: 'users',
        redirect: '',
        name: 'user',
        title: 'shell:user',
        nav: Nav.None
      }, {
        route: 'users/create',
        name: 'createUser',
        title: 'shell:create',
        moduleId: 'users/create',
        nav: Nav.None
      }, {
        route: 'users/setup',
        name: 'setup',
        title: 'shell:setup',
        moduleId: 'users/setup',
        nav: Nav.Setup
      }, {
        route: 'judge',
        redirect: '',
        name: 'judge',
        title: 'shell:judges',
        nav: Nav.Setup,
        settings: {
          group: 'judge',
          iconClass: 'fa fa-gavel'
        }
      }, {
        route: 'users/judges/create',
        name: 'createJudge',
        title: 'shell:createJudge',
        moduleId: 'users/judges/create',
        nav: Nav.Setup,
        settings: {
          parent: 'judge',
          iconClass: 'fa fa-plus'
        }
      }, {
        route: 'challenge',
        redirect: '',
        name: 'challenge',
        title: 'shell:challenges',
        nav: Nav.Setup,
        settings: {
          group: 'challenge',
          iconClass: 'fa fa-balance-scale'
        }
      }, {
        route: 'challenges/create',
        name: 'createChallenge',
        title: 'shell:createChallenge',
        moduleId: 'challenges/create',
        nav: Nav.Setup,
        settings: {
          parent: 'challenge',
          iconClass: 'fa fa-plus'
        }
      }, {
        route: 'claim',
        redirect: '',
        name: 'claim',
        title: 'shell:claims',
        nav: Nav.Setup,
        settings: {
          group: 'claim',
          iconClass: 'fa fa-bullhorn'
        }
      }, {
        route: 'claims/create',
        name: 'createClaim',
        title: 'shell:createClaim',
        moduleId: 'claims/create',
        nav: Nav.Setup,
        settings: {
          parent: 'claim',
          iconClass: 'fa fa-plus'
        }
      }, {
        route: 'federation',
        redirect: '',
        name: 'federation',
        title: 'shell:federations',
        nav: Nav.Setup,
        settings: {
          group: 'federation',
          iconClass: 'fa fa-university'
        }
      }, {
        route: 'users/federations/create',
        name: 'createFederation',
        title: 'shell:createFederation',
        moduleId: 'users/federations/create',
        nav: Nav.Setup,
        settings: {
          parent: 'federation',
          iconClass: 'fa fa-plus'
        }
      }, {
        route: 'pending',
        name: 'pending',
        title: 'shell:pending',
        nav: Nav.Setup,
        moduleId: 'pending/index',
        settings: { iconClass: 'fa fa-stack-overflow' }
      }
    ]);

    config.addPreRenderStep({
      run: (instruction, next) => {
        this.navtype = instruction.config.nav as Nav;
        return next();
      }
    });

    router.ensureConfigured();
  }
}
