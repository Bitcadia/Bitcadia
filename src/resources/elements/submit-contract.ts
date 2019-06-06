import { IContract } from '../../models/contracts/contract';
import { DataContext, DBType } from "../../models/contracts/dataContext";
import { bindable, customElement, containerless, computedFrom } from 'aurelia-framework';
import * as _ from 'lodash';
import { ValidationController } from 'aurelia-validation';
import { Edit, View } from 'resources/contractModule';
import { AppRouter } from 'aurelia-router';

/**
 * SubmitContract
 */
@containerless()
@customElement('submit-contract')
export class SubmitContract {
  @bindable
  public contract: IContract;
  @bindable
  public addNewCallBack: Function;
  @bindable
  public compose: { currentViewModel: View | Edit };
  @bindable
  public dbtype: DBType;

  public saveCart: boolean = false;
  public saveCommit: boolean = false;

  constructor(
    public dataContext: DataContext,
    private controller: ValidationController,
    private router: AppRouter) {
  }

  @computedFrom('controller.errors.length', 'contract')
  get disabled(): boolean {
    let disabled = !this.contract;
    if (this.controller && this.controller.errors.length) {
      disabled = true;
    }
    return disabled;
  }

  @computedFrom('saveCart', 'saveCommit', 'contract')
  get addNew(): boolean {
    return this.contract && this.contract._id && !this.saveCart && !this.saveCommit;
  }

  saveContract() {
    this.saveCart = true;
    return this.controller.validate().then((result) => {
      if (result.valid) {
        return this.dataContext.getInstance(this.dbtype).bulkDocs(this.allContracts()).then((results) => {
          _.zip<IContract | PouchDB.Core.Response | PouchDB.Core.Error>(this.allContracts(), results)
            .forEach((pair: [IContract, PouchDB.Core.Response]) => pair[0]._id = pair[1].id);
          if ("postCreate" in this.compose.currentViewModel) {
            this.router.navigateToRoute(this.compose.currentViewModel.postCreate);
          }
          this.saveCart = false;
          return this.addNewCallBack();
        });
      }
    });
  }

  allContracts() {
    return [this.contract];
  }
}
