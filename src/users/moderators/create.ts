import { AppRouter } from 'aurelia-router';
import { computedFrom, autoinject } from 'aurelia-framework';
import { Claim } from '../../models/contracts/claims/claim';
import { IBaseClaim } from '../../models/contracts/claims/base';
import { ValidationController } from 'aurelia-validation';
import { DBType } from 'models/contracts/dataContext';

interface ClaimSelection {
  factory(): IBaseClaim;
  instance?: IBaseClaim;
  displayName: string;
}
@autoinject
export class Create {
  public dbtype: DBType = "Cart";
  public bind: boolean = false;
  @computedFrom('selectedClaimType', 'selectedClaimType.instance')
  get contract(): IBaseClaim {
    return this.selectedClaimType &&
      (this.selectedClaimType.instance ||
        (this.selectedClaimType.instance = this.selectedClaimType.factory())
      );
  }

  @computedFrom('contract._id')
  get contractType(): string {
    if (this.contract && this.contract._id) {
      return 'view';
    }
    return 'edit';
  }

  @computedFrom('controller.errors')
  get errors() {
    return this.controller && this.controller.errors;
  }

  public selectedClaimType: ClaimSelection;

  constructor(public router: AppRouter, private controller: ValidationController) {
    this.selectedClaimType = { factory: () => new Claim(null), displayName: "claim:claim" };
  }

  public addNew() {
    const create = this;
    return () => {
      create.selectedClaimType.instance;
      this.router.navigateToRoute("claims/create");
    };
  }
}
