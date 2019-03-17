import { IContract, Contract } from '../../models/contracts/contract';
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
    constructor() {
    }

    deleteContract() {
        this.deletingCommit = true;
        return Contract.DataContext.getInstance()
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
        return this.contracts || [this.contract]
    }

    allContractIds() {
        return this.allContracts()
            .map((contract) => contract._id)
            .filter((id) => id);
    }
}