import { computedFrom } from 'aurelia-framework';
import { IBaseFederation } from '../../models/contracts/federations/base';
import { Federation } from '../../models/contracts/federations/federation';
import { DBType } from 'models/contracts/dataContext';

interface FederationSelection {
  factory(): IBaseFederation;
  instance?: IBaseFederation;
  displayName: string;
}
export class Create {
  public dbtype: DBType = "Cart";

  @computedFrom('contract._id')
  get contractType(): string {
    return (this.contract && this.contract._id) ? 'view' : 'edit';
  }
  public contract = new Federation(null);
  public FederationDropDownOptions: FederationSelection[];

  public addNew() {
    const create = this;
    return () => {
      create.contract = new Federation(null);
    };
  }
}
