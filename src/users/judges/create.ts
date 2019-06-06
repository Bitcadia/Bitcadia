import { bindable, computedFrom } from 'aurelia-framework';
import { IBaseJudge } from '../../models/contracts/judges/base';
import { Judge } from '../../models/contracts/judges/judge';
import { DBType } from 'models/contracts/dataContext';

interface JudgeSelection {
  factory(): IBaseJudge;
  instance?: IBaseJudge;
  displayName: string;
}
export class Create {
  public dbtype: DBType = "Cart";

  @computedFrom('contract._id')
  get contractType(): string {
    return (this.contract && this.contract._id) ? 'view' : 'edit';
  }
  public contract = new Judge(null);
  public JudgeDropDownOptions: JudgeSelection[];

  public addNew() {
    const create = this;
    return () => {
      create.contract = new Judge(null);
    };
  }
}
