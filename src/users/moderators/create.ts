import { Router } from 'aurelia-router';
import { computedFrom, autoinject, Controller } from 'aurelia-framework';
import { Claim } from '../../models/contracts/claims/claim';
import { IBaseClaim } from '../../models/contracts/claims/base';
import { ValidationController } from 'aurelia-validation';

interface ClaimSelection {
  factory: () => { entity: IBaseClaim },
  instance?: { entity: IBaseClaim },
  displayName: string
}
@autoinject
export class Create {
  public bind: boolean = false;
  @computedFrom('selectedClaimType', 'selectedClaimType.instance')
  get contract(): { entity?: IBaseClaim, controller?: ValidationController } {
    return this.selectedClaimType &&
      (this.selectedClaimType.instance ||
        (this.selectedClaimType.instance = this.selectedClaimType.factory())
      );
  }

  @computedFrom('contract.entity._id')
  get contractType(): string {
    if (this.contract && this.contract.entity._id) {
      return 'view';
    }
    return 'edit';
  }

  @computedFrom('contract.controller.errors')
  get errors() {
    return this.contract.controller && this.contract.controller.errors
  }

  public selectedClaimType: ClaimSelection;

  constructor(public router: Router) {
    this.selectedClaimType = { factory: () => { return { entity: new Claim(null) } }, displayName: "claim:claim" };
  }

  public addNew() {
    var create = this;
    return () => {
      create.selectedClaimType.instance.entity;
      this.router.navigateToRoute("claims/create");
    }
  }
}
