import { Router } from 'aurelia-router';
import { computedFrom, autoinject, Controller } from 'aurelia-framework';
import { User } from '../models/contracts/users/user';
import { IBaseUser } from '../models/contracts/users/base';
import { ValidationController } from 'aurelia-validation';
import { CurrentUser, GetCurrentUser } from './current';

interface UserSelection {
  factory: () => { entity: IBaseUser },
  instance?: { entity: IBaseUser },
  displayName: string
}
@autoinject
export class Create {
  public bind: boolean = false;
  @computedFrom('selectedUserType', 'selectedUserType.instance')
  get contract(): { entity?: IBaseUser, controller?: ValidationController } {
    return this.selectedUserType &&
      (this.selectedUserType.instance ||
        (this.selectedUserType.instance = this.selectedUserType.factory())
      );
  }

  @computedFrom('contract.entity._id')
  get contractType(): string {
    if (this.contract && this.contract.entity._id) {
      GetCurrentUser().then(() => {
        CurrentUser.decryptedUser = CurrentUser.user;
      });
      return 'view';
    }
    return 'edit';
  }

  @computedFrom('contract.controller.errors')
  get errors() {
    return this.contract.controller && this.contract.controller.errors
  }

  public selectedUserType: UserSelection;

  constructor(public router: Router) {
    this.selectedUserType = { factory: () => { return { entity: new User(null) } }, displayName: "user:user" };
  }

  public activate() {
    return GetCurrentUser().then((user) => {
      if (user) {
        this.router.navigate("home")
      }
      else {
        this.bind = true;
      }
    });
  }

  public addNew() {
    var create = this;
    return () => {
      CurrentUser.user = create.selectedUserType.instance.entity;
      this.router.navigateToRoute("setup");
    }
  }
}
