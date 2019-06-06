///<amd-dependency path="bootstrap"/>
import { CurrentUser } from './users/current';
import { RouterConfiguration, Router, AppRouter, NavModel } from 'aurelia-router';
import * as _ from 'lodash';
import { computedFrom } from 'aurelia-binding';
import { Nav } from './resources/elements/nav-bar';
import { autoinject } from 'aurelia-framework';


export const enum RouteNames {
  home = "home",
  user = "user",
  createUser = "createUser",
  setup = "setup",
  judge = "judge",
  createJudge = "createJudge",
  curator = "curator",
  createcurator = "createcurator",
  moderator = "moderator",
  createmoderator = "createmoderator",
  federation = "federation",
  createFederation = "createFederation",
  pending = "pending",
}

@autoinject
export class App {
  public navtype: Nav;

  constructor(private currentUser: CurrentUser) { }

  configureRouter(config: RouterConfiguration, router: AppRouter) {
    config.title = 'shell:SiteName';

    config.map([
      {
        route: ['', 'home'],
        name: RouteNames.home,
        title: 'shell:home',
        moduleId: 'home/index'
      }, {
        route: 'users',
        redirect: '',
        name: RouteNames.user,
        title: 'shell:user',
        nav: Nav.None
      }, {
        route: 'users/create',
        name: RouteNames.createUser,
        title: 'shell:create',
        moduleId: 'users/create',
        nav: Nav.None
      }, {
        route: 'users/setup',
        name: RouteNames.setup,
        title: 'shell:setup',
        moduleId: 'users/setup',
        nav: Nav.Setup
      }, {
        route: 'judge',
        redirect: '',
        name: RouteNames.judge,
        title: 'shell:judges',
        nav: Nav.Setup,
        settings: {
          group: 'judge',
          iconClass: 'fa fa-gavel'
        }
      }, {
        route: 'users/judges/create',
        name: RouteNames.createJudge,
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
        name: RouteNames.curator,
        title: 'shell:curators',
        nav: Nav.Setup,
        settings: {
          group: 'curator',
          iconClass: 'fa fa-balance-scale'
        }
      }, {
        route: 'users/curators/create',
        name: RouteNames.createcurator,
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
        name: RouteNames.moderator,
        title: 'shell:moderators',
        nav: Nav.Setup,
        settings: {
          group: 'moderator',
          iconClass: 'fa fa-bullhorn'
        }
      }, {
        route: 'users/moderators/create',
        name: RouteNames.createmoderator,
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
        name: RouteNames.federation,
        title: 'shell:federations',
        nav: Nav.Setup,
        settings: {
          group: 'federation',
          iconClass: 'fa fa-university'
        }
      }, {
        route: 'users/federations/create',
        name: RouteNames.createFederation,
        title: 'shell:createFederation',
        moduleId: 'users/federations/create',
        nav: Nav.Setup,
        settings: {
          parent: 'federation',
          iconClass: 'fa fa-plus'
        }
      }, {
        route: 'pending',
        name: RouteNames.pending,
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
