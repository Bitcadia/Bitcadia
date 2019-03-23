import { Router } from 'aurelia-router';
import { CurrentUser } from '../../users/current';
import { autoinject, computedFrom } from "aurelia-framework";
import { DialogController } from "aurelia-dialog";
import { ValidationController, ValidationRules } from "aurelia-validation";

@autoinject()
export class LogIn {
  public decryptPassword = null;
  public errors = [];
  constructor(public dialogController: DialogController, public validateController: ValidationController, public router: Router) {
    dialogController.settings.lock = false;
    dialogController.settings.centerHorizontalOnly = true;
  }

  @computedFrom('validateController.errors.length')
  get disabled(): boolean {
    let disabled = false;
    if (this.validateController && this.validateController.errors.filter((err) => err.object === this).length) {
      disabled = true;
    }
    return disabled;
  }

  public activate() {
    this.errors = [];
    this.decryptPassword = null;

    const rules = ValidationRules
      .ensure("decryptPassword").required()
      .satisfies((obj: LogIn) => obj === (<any>CurrentUser.user).password)
      .withMessage("Passwords do not match").rules;

    this.validateController.addObject(this, rules);
  }

  public deactivate() {
    this.validateController.removeObject(this);
  }

  public ok() {
    return this.validateController.validate({ object: this }).then((result) => {
      if (result.valid) {
        CurrentUser.login(this.decryptPassword);
        CurrentUser.decryptedUser.setup || this.router.navigateToRoute("setup");
        this.dialogController.ok(this.decryptPassword);
      }
    });
  }
}
