import { IContract, Contract } from '../../models/contracts/contract';
import { bindable, customElement, containerless, inject, computedFrom } from 'aurelia-framework';
import * as _ from 'lodash';

/**
 * SubmitContract
 */
@inject(Element)
@containerless()
@customElement('submit-contract')
export class SubmitContract {
    @bindable contract: IContract;
    @bindable contracts: IContract[];
    @bindable addNewCallBack: Function;
    public saveCart: boolean = false;
    public saveCommit: boolean = false;
    constructor() {
    }

    @computedFrom('contract', 'contracts')
    get disabled(): boolean {
        return !(this.contract || (this.contracts && this.contracts.length));
    }

    @computedFrom('saveCart', 'saveCommit', 'contract')
    get addNew(): boolean {
        return this.contract && this.contract._id && !this.saveCart && !this.saveCommit;
    }

    cartContract() {
        this.saveCart = true;
        return Contract.DataContext.getInstance().bulkDocs(this.allContracts()).then((results) => {
            _.zip<IContract | PouchDB.Core.Response>(this.allContracts(), results)
                .forEach((pair: [IContract, PouchDB.Core.Response]) => pair[0]._id = pair[1].id);
            this.saveCart = false;
        });
    }

    commitContract() {
        debugger;
    }

    allContracts() {
        return this.contracts || [this.contract]
    }

    allContractIds() {
        return this.allContracts()
            .map((contract) => contract._id)
            .filter((id) => id);
    }
}