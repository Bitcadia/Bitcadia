import { CurrentUser } from './../../users/current';
import { Logout } from '../prompts/log-out';
import { customElement, autoinject, computedFrom } from 'aurelia-framework';
import { DialogService } from 'aurelia-dialog';
import { AppRouter } from 'aurelia-router';
import { LogIn } from '../prompts/log-in';
import { RouteNames } from 'app';

@customElement('log-in-out')
@autoinject
export default class LogInOut {
  @computedFrom("currentUser.users")
  public get hasUser(): boolean {
    return !!this.currentUser.users.length;
  }
  @computedFrom("currentUser.decryptedUser")
  public get hasDecryptedUser(): boolean {
    return !!this.currentUser.decryptedUser;
  }

  constructor(public currentUser: CurrentUser, public dialogService: DialogService, public router: AppRouter) { }

  public logIn() {
    this.dialogService.open({ viewModel: LogIn });
  }
  public logout() {
    this.dialogService.open({ viewModel: Logout });
  }
  public register() {
    this.router.navigateToRoute(RouteNames.createUser);
  }
  public setup() {
    this.router.navigateToRoute(RouteNames.setup);
  }
}
