import { NavModel, AppRouter } from 'aurelia-router';
import { autoinject } from 'aurelia-framework';
import { CurrentUser } from './current';
import { Nav } from '../resources/elements/nav-bar';
import * as _ from 'lodash';
import { DialogService } from 'aurelia-dialog';
import { LogIn } from 'resources/prompts/log-in';
import { RouteNames } from 'app';

@autoinject
export class Setup {
  public groupedNavigation: NavModel[];
  public navtype: Nav = Nav.Setup;

  constructor(private appRouter: AppRouter, private currentUser: CurrentUser, private dialogService: DialogService) { }

  public async canActivate() {
    const user = await this.currentUser.loadUsers();
    if (!user.length) {
      setImmediate(() => {
        this.appRouter.navigateToRoute(RouteNames.createUser);
      });
      return false;
    }
    return true;
  }

  public async activate() {
    if (!this.currentUser.decryptedUser) {
      this.dialogService.open({ viewModel: LogIn });
    }
  }
}
