import { ContractModule } from '../resources/contractModule';
import { Contract } from "../models/contracts/contract";
import { bindable, computedFrom } from 'aurelia-framework';
import { FreeActor } from '../models/contracts/actors/free';
import { SignedActor } from '../models/contracts/actors/signed';
import { IBaseReferee } from '../models/contracts/referees/base'
import { IBaseActor } from '../models/contracts/actors/base'
import { Referee } from '../models/contracts/referees/referee';

interface RefereeSelection {
    factory: () => IBaseReferee,
    instance?: IBaseReferee,
    displayName: string
}
export class Create {
    @computedFrom('contract._id')
    get contractType(): string {
        return (this.contract && this.contract._id) ? 'view' : 'edit';
    }
    public contract = new Referee(null) ;
    public RefereeDropDownOptions: RefereeSelection[];

    public addNew() {
        var create = this;
        return ()=>{
            create.contract = new Referee(null);
        }
    }
}