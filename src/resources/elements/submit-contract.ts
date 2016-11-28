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
    constructor() {
    }

    @computedFrom('contract', 'contracts')
    get disabled(): boolean {
        return !(this.contract || (this.contracts && this.contracts.length));
    }

    cartContract() {
        var contracts: IContract[] = this.contracts || [this.contract];
        Contract.DataContext.getInstance().bulkDocs(contracts).then((results) =>
            _.zip<IContract | PouchDB.Core.Response>(this.contracts, results)
                .forEach((pair: [IContract, PouchDB.Core.Response]) => pair[0]._id = pair[1].id)
        )
    }
    commitContract() {
        debugger;
    }
}