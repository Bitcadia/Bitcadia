import { IContract } from '../../models/contracts/contract';
import { DataContext } from '../../models/contracts/dataContext';
import { bindable, customElement, containerless, inject, computedFrom } from 'aurelia-framework';
import * as _ from 'lodash';

/**
 * SubmitContract
 */
@inject(Element)
@containerless()
@customElement('commit-contract')
export class CommitContract {
  @bindable contract: IContract;
  @bindable contracts: IContract[];
  @bindable deleteCallBack: Function;
  public deletingCommit: boolean = false;
  public savingCommit: boolean = false;
  constructor(public dataContext: DataContext) { }

  deleteContract() {
    this.deletingCommit = true;
    return this.dataContext.getInstance("Cart")
      .bulkDocs(
        _.each(this.allContracts(), (contract) => contract['_deleted'] = true)
      ).then((results) => {
        this.deleteCallBack();
        this.deletingCommit = false;
      });
  }

  @computedFrom('saveCart', 'saveCommit', 'contract')
  get disabled(): boolean {
    return this.deletingCommit || this.savingCommit;
  }

  commitContract() {
  }

  allContracts() {
    return this.contracts || [this.contract];
  }
}
