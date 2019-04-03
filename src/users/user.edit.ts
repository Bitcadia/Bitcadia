import { Disposable } from 'aurelia-binding';
import { autoinject } from 'aurelia-dependency-injection';
import { ValidationController, ValidationRules } from 'aurelia-validation';
import { User } from '../models/contracts/users/user';
import { words } from './words';
import { uniq, sample } from "lodash";
import { bindable } from 'aurelia-framework';

@autoinject
export class RegistrationForm {
  public contract: User;
  public validated: boolean;
  public seedErrors: any[] = [];
  public passwordErrors: any[] = [];
  public sub: Disposable;
  @bindable controller: ValidationController;
  constructor(validationController: ValidationController) {
    this.controller = validationController;
  }

  public generateSeed() {
    this.contract.seed = (Array.apply(null, Array(12))).map(() => sample(words)).join(" ");
  }

  public activate(model) {
    this.contract = model.entity;
    const rules = ValidationRules
      .ensure('seed').required().withMessage("user:seedRequired")
      .satisfies((val: string) => {
        const vals = (val || "").split(" ");
        return vals.every((word) => words.includes(word)) && uniq(vals).length == 12;
      }).withMessage("user:seedInvalid")
      .ensure("password").required().withMessage("user:passwordRequired")
      .satisfies((val, obj: any) => obj && obj.passwordRepeat === obj.password)
      .withMessage("user:passwordMismatch").rules;
    this.controller.addObject(this.contract, rules);
    this.sub = this.controller.subscribe((event) => {
      if (!event.instruction) this.validated = true;
    });
    model.controller = this.controller;
  }
  public deactivate() {
    this.sub.dispose();
    this.controller.removeObject(this.contract);
  }
}
