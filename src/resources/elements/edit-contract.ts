import { ContractModule } from '../contractModule';
import { bindable, customElement, containerless, useView, computedFrom } from 'aurelia-framework';

@containerless()
@customElement('edit-contract')
@useView('./contract.html')
export class EditContract {
    @bindable contract;

    @computedFrom('contract')
    public get module() : string {
        return this.contract && ContractModule.getEdit(this.contract);
    }
}