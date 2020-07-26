import { ContractModule, ViewType, Edit, View, Modules } from '../contractModule';
import { bindable, customElement, containerless, computedFrom, autoinject } from 'aurelia-framework';
import { IContract } from 'models/contracts/contract';
import { BindingSignaler } from 'aurelia-templating-resources';

@containerless()
@customElement('contract')
@autoinject
export class ViewContract {
  @bindable compose: { currentViewModel: View | Edit } = null;
  @bindable contract: IContract;
  @bindable type: ViewType;

  public viewModule: string;
  public viewModelModule: string;

  private useVMImpl: boolean;

  constructor(private contractModule: ContractModule, private signaler: BindingSignaler) { }

  @computedFrom('contract', 'type')
  public get module() {
    const view = this.contractModule.getView(this.contract, this.type);
    this.viewModule = view.viewModule;
    this.viewModelModule = view.viewModelModule;
    this.useVMImpl = !!(view.viewModule && view.viewModelModule);
    return view;
  }

  @computedFrom('module', 'useVMImpl')
  public get useVM() {
    return this.useVMImpl;
  }
}
