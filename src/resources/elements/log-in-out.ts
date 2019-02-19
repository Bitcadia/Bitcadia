import { CurrentUser } from './../../users/current';
import { LogOut } from '../prompts/log-out';
import { customElement, autoinject, computedFrom } from 'aurelia-framework';
import { DialogService } from 'aurelia-dialog';
import { Router } from 'aurelia-router';
import { LogIn } from '../prompts/log-in';

@customElement('log-in-out')
@autoinject()
export default class LogInOut {
  public currentUser = CurrentUser;

  @computedFrom("currentUser.user")
  public get hasUser(): boolean {
    return !!this.currentUser.user;
  }
  @computedFrom("currentUser.decryptedUser")
  public get hasDecryptedUser(): boolean {
    return !!this.currentUser.decryptedUser;
  }


  constructor(public dialogService: DialogService, public router: Router) { }
  public logIn() {
    this.dialogService.open({ viewModel: LogIn });
  }
  public logOut() {
    this.dialogService.open({ viewModel: LogOut });
  }
  public register() {
    this.router.navigateToRoute("createUser");
  }
}
