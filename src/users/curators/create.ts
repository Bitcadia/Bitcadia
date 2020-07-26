import { computedFrom } from 'aurelia-framework';
import { IBaseChallenge } from '../../models/contracts/challenges/base';
import { Challenge } from '../../models/contracts/challenges/challenge';
import { DBType } from 'models/contracts/dataContext';

interface ChallengeSelection {
  factory(): IBaseChallenge;
  instance?: IBaseChallenge;
  displayName: string;
}
export class Create {
  public dbtype: DBType = "Cart";

  @computedFrom('contract._id')
  get contractType(): string {
    return (this.contract && this.contract._id) ? 'view' : 'edit';
  }
  public contract = new Challenge(null);
  public ChallengeDropDownOptions: ChallengeSelection[];

  public addNew() {
    const create = this;
    return () => {
      create.contract = new Challenge(null);
    };
  }
}
