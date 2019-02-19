import { ContractModule } from '../../resources/contractModule';
import { Contract } from "../../models/contracts/contract";
import { bindable, computedFrom } from 'aurelia-framework';
import { IBaseJudge } from '../../models/contracts/judges/base'
import { Judge } from '../../models/contracts/judges/judge';

interface JudgeSelection {
  factory: () => IBaseJudge,
  instance?: IBaseJudge,
  displayName: string
}
export class Create {
  @computedFrom('contract._id')
  get contractType(): string {
    return (this.contract && this.contract._id) ? 'view' : 'edit';
  }
  public contract = new Judge(null);
  public JudgeDropDownOptions: JudgeSelection[];

  public addNew() {
    var create = this;
    return () => {
      create.contract = new Judge(null);
    }
  }
}
