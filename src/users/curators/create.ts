import { ContractModule } from '../../resources/contractModule';
import { Contract } from "../../models/contracts/contract";
import { bindable, computedFrom } from 'aurelia-framework';
import { IBaseChallenge } from '../../models/contracts/challenges/base';
import { Challenge } from '../../models/contracts/challenges/challenge';

interface ChallengeSelection {
    factory(): IBaseChallenge;
    instance?: IBaseChallenge;
    displayName: string;
}
export class Create {
    @computedFrom('contract._id')
    get contractType(): string {
        return (this.contract && this.contract._id) ? 'view' : 'edit';
    }
    public contract = new Challenge(null);
    public ChallengeDropDownOptions: ChallengeSelection[];

    public addNew() {
        let create = this;
        return () => {
            create.contract = new Challenge(null);
        };
    }
}
