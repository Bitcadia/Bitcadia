import { AppRouter } from 'aurelia-router';
import { CurrentUser } from '../../users/current';
import { autoinject, computedFrom } from "aurelia-framework";
import { DialogController } from "aurelia-dialog";
import { ValidationController, ValidationRules } from "aurelia-validation";
import { IBaseUser } from 'models/contracts/users/base';

@autoinject
export class LogIn {
  public decryptPassword: string;
  public name: string;
  public passwordErrors = [];
  public nameErrors = [];
  private rules = ValidationRules
    .ensure("name").required().withMessage("user:nameRequired")
    .ensure("decryptPassword").required()
    .satisfies(async (decryptPassword, contract: IBaseUser) => {
      const users = await this.currentUser.usersPromise;
      const user = users.find((val) => val.name === contract.name);
      return decryptPassword === (user && user.password);
    })
    .withMessage("user:passwordMismatch").rules;
  constructor(
    public dialogController: DialogController,
    public validateController: ValidationController,
    public router: AppRouter,
    private currentUser: CurrentUser) {
  }

  @computedFrom('validateController.errors.length')
  get disabled(): boolean {
    let disabled = false;
    if (this.validateController && this.validateController.errors.filter((err) => err.object === this).length) {
      disabled = true;
    }
    return disabled;
  }

  public async canActivate() {
    const users = await this.currentUser.loadUsers();
    if (!users.length) {
      return false;
    }
    return true;
  }

  public activate() {
    this.dialogController.settings.lock = false;
    this.dialogController.settings.centerHorizontalOnly = true;
    this.passwordErrors = [];
    this.nameErrors = [];
    this.decryptPassword = null;
    this.name = null;

    this.validateController.addObject(this, this.rules);
  }

  public deactivate() {
    this.validateController.removeObject(this);
  }

  public async ok() {
    const result = await this.validateController.validate({ object: this });
    if (result.valid) {
      await this.currentUser.login(this.name, this.decryptPassword);
      this.dialogController.ok(this.decryptPassword);
    }
  }
}
