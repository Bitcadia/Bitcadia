import { ContractModule, ViewType } from '../contractModule';
import { bindable, customElement, containerless, useView, computedFrom } from 'aurelia-framework';

@containerless()
@customElement('contract')
export class ViewContract {
  @bindable contract;
  @bindable type: ViewType;

  @computedFrom('contract', 'type')
  public get module(): [string, string] {
    return this.contract && this.contract.entity && ContractModule.getView(this.contract.entity, this.type);
  }

  @computedFrom('module')
  public get useVM(): boolean {
    return !!(this.module && this.module[1]);
  }
}
