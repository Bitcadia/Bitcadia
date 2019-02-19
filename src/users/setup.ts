import { Router, NavModel, RouterConfiguration, AppRouter } from 'aurelia-router';
import { autoinject } from 'aurelia-framework';
import { CurrentUser } from './current';
import { Nav } from '../resources/elements/nav-bar';
import * as _ from 'lodash';

@autoinject
export class Setup {
  public currentUser = CurrentUser;
  public router: Router;
  public groupedNavigation: NavModel[];
  public navtype: Nav = Nav.Setup;

  constructor(private appRouter: AppRouter) { }

  public activate() {
    return CurrentUser.user || this.appRouter.navigateToRoute("createUser");
  }
}
