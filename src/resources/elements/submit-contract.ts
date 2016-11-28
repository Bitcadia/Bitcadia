import { IContract } from '../../models/contracts/contract';
import { bindable, customElement, containerless, inject, computedFrom } from 'aurelia-framework';

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
    
    cartContract(){
        debugger;
    }
    commitContract(){
        debugger;
    }
}