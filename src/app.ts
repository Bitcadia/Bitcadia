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
        route: 'curator',
        redirect: '',
        name: 'curator',
        title: 'shell:curators',
        nav: Nav.Setup,
        settings: {
          group: 'curator',
          iconClass: 'fa fa-balance-scale'
        }
      }, {
        route: 'users/curators/create',
        name: 'createcurator',
        title: 'shell:createcurator',
        moduleId: 'users/curators/create',
        nav: Nav.Setup,
        settings: {
          parent: 'curator',
          iconClass: 'fa fa-plus'
        }
      }, {
        route: 'moderator',
        redirect: '',
        name: 'moderator',
        title: 'shell:moderators',
        nav: Nav.Setup,
        settings: {
          group: 'moderator',
          iconClass: 'fa fa-bullhorn'
        }
      }, {
        route: 'users/moderators/create',
        name: 'createmoderator',
        title: 'shell:createmoderator',
        moduleId: 'users/moderators/create',
        nav: Nav.Setup,
        settings: {
          parent: 'moderator',
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
