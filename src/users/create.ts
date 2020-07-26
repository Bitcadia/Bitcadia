import { AppRouter } from 'aurelia-router';
import { computedFrom, autoinject } from 'aurelia-framework';
import { User } from '../models/contracts/users/user';
import { IBaseUser } from '../models/contracts/users/base';
import { ValidationController } from 'aurelia-validation';
import { CurrentUser } from './current';
import { RouteNames } from '../app';
import { View, Edit } from 'resources/contractModule';
import { DBType, DataContext } from 'models/contracts/dataContext';

interface UserSelection {
  factory(): IBaseUser;
  instance?: IBaseUser;
  displayName: string;
}
@autoinject
export class Create {
  public dbtype: DBType = "Account";
  public compose: { currentViewModel: (View | Edit) };

  @computedFrom('selectedUserType', 'selectedUserType.instance')
  get contract(): IBaseUser & { password?: string } {
    return this.selectedUserType &&
      (this.selectedUserType.instance ||
        (this.selectedUserType.instance = this.selectedUserType.factory())
      );
  }

  public contractType: string = 'edit';

  @computedFrom('contract.controller.errors')
  get errors() {
    return this.controller && this.controller.errors;
  }

  public selectedUserType: UserSelection;

  constructor(
    public router: AppRouter,
    private currentUser: CurrentUser,
    private controller: ValidationController,
    dataContext: DataContext) {
    this.selectedUserType = { factory: () => { return new User(dataContext); }, displayName: "user:user" };
  }

  public async canActivate() {
    if (this.currentUser.decryptedUser) {
      return { redirect: RouteNames.setup };
    }
    return true;
  }

  public async activate() {
    this.selectedUserType.instance = this.selectedUserType.factory();
  }

  public addNew() {
    return async () => {
      await this.currentUser.login(this.contract.name, this.contract.password);
      this.router.navigateToRoute(RouteNames.setup);
    };
  }
}
