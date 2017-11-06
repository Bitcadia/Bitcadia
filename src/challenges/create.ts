import { ContractModule } from '../resources/contractModule';
import { Contract } from "../models/contracts/contract";
import { bindable, computedFrom } from 'aurelia-framework';
import { SignedActor } from '../models/contracts/actors/signed';
import { IBaseChallenge } from '../models/contracts/challenges/base'
import { IBaseActor } from '../models/contracts/actors/base'
import { Challenge } from '../models/contracts/challenges/challenge';

interface ChallengeSelection {
    factory: () => IBaseChallenge,
    instance?: IBaseChallenge,
    displayName: string
}
export class Create {
    @computedFrom('contract._id')
    get contractType(): string {
        return (this.contract && this.contract._id) ? 'view' : 'edit';
    }
    public contract = new Challenge(null);
    public ChallengeDropDownOptions: ChallengeSelection[];

    public addNew() {
        var create = this;
        return () => {
            create.contract = new Challenge(null);
        }
    }
}