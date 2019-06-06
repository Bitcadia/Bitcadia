import { Disposable } from 'aurelia-binding';
import { autoinject } from 'aurelia-dependency-injection';
import { ValidationController, ValidationRules } from 'aurelia-validation';
import { User } from '../models/contracts/users/user';
import { words } from './words';
import { uniq, sample } from "lodash";
import { Edit } from '../resources/contractModule';
import { RouteNames } from '../app';
import { DBType } from "../models/contracts/dataContext";
import { CurrentUser } from './current';

@autoinject
export default class RegistrationForm implements Edit {
  public dbtype: DBType = "Account";
  public postCreate = RouteNames.setup;
  public contract: User;
  public validated: boolean;
  public seedErrors: any[] = [];
  public passwordErrors: any[] = [];
  public nameErrors: any[] = [];
  public sub: Disposable;

  private rules: ValidationRules = ValidationRules
    .ensure('seed').required().withMessage("user:seedRequired")
    .satisfies((val: string) => {
      const vals = (val || "").split(" ");
      return vals.every((word) => words.includes(word)) && uniq(vals).length == 12;
    }).withMessage("user:seedInvalid")
    .ensure("name").required().withMessage("user:nameRequired")
    .satisfies(async (val: string, obj: any) => {
      const users = await this.currentUser.loadUsers();
      return users.every((user) => user.name !== val);
    }).withMessage("user:nameUnique")
    .ensure("password").required().withMessage("user:passwordRequired")
    .satisfies((val, obj: any) => obj && obj.passwordRepeat === obj.password)
    .withMessage("user:passwordMismatch").rules;

  constructor(private validationController: ValidationController, private currentUser: CurrentUser) { }

  public generateSeed() {
    this.contract.seed = (Array.apply(null, Array(12)))
      .map(() => sample(words)).join(" ");
  }

  public activate(model: User) {
    this.contract = model;
    this.validationController.addObject(this.contract, this.rules);
    this.sub = this.validationController.subscribe((event) => {
      if (!event.instruction)
        this.validated = true;
    });
  }

  public deactivate() {
    this.sub.dispose();
    this.validationController.removeObject(this.contract);
    this.contract = null;
  }
}
