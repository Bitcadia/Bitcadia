import { ContractModule } from '../contractModule';
import { bindable, customElement, containerless, useView, computedFrom } from 'aurelia-framework';

@containerless()
@customElement('view-contract')
@useView('./contract.html')
export class ViewContract {
    @bindable contract;

    @computedFrom('contract')    
    public get module() : string {
        return this.contract && ContractModule.getView(this.contract);
    }
}