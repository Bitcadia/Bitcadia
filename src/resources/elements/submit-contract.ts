import { IContract, Contract } from '../../models/contracts/contract';
import { bindable, customElement, containerless, inject, computedFrom } from 'aurelia-framework';
import * as _ from 'lodash';
import { ValidationController } from 'aurelia-validation';

/**
 * SubmitContract
 */

@containerless()
@customElement('submit-contract')
export class SubmitContract {
  @bindable contract: { entity?: IContract, controller?: ValidationController };
  @bindable addNewCallBack: Function;
  public saveCart: boolean = false;
  public saveCommit: boolean = false;
  constructor() {
  }

  @computedFrom('contract.controller.errors.length', 'contract.entity')
  get disabled(): boolean {
    let disabled = !this.contract.entity;
    if (this.contract.controller && this.contract.controller.errors.length) {
      disabled = true;
    }
    return disabled;
  }

  @computedFrom('saveCart', 'saveCommit', 'contract')
  get addNew(): boolean {
    return this.contract && this.contract.entity && this.contract.entity._id && !this.saveCart && !this.saveCommit;
  }

  cartContract() {
    this.saveCart = true;
    return this.contract.controller.validate().then((result) => {
      if (result.valid) {
        return Contract.DataContext.getInstance().bulkDocs(this.allContracts()).then((results) => {
          _.zip<IContract | PouchDB.Core.Response | PouchDB.Core.Error>(this.allContracts(), results)
            .forEach((pair: [IContract, PouchDB.Core.Response]) => pair[0]._id = pair[1].id);
          this.saveCart = false;
        });
      }
    })

  }

  allContracts() {
    return [this.contract.entity]
  }

  allContractIds() {
    return this.allContracts()
      .map((contract) => contract._id)
      .filter((id) => id);
  }
}
