import { ContractModule } from '../resources/contractModule';
import { Contract } from "../models/contracts/contract";
import { bindable, computedFrom } from 'aurelia-framework';
import { FreeActor } from '../models/contracts/actors/free';
import { SignedActor } from '../models/contracts/actors/signed';
import { IBaseClaim } from '../models/contracts/claims/base'
import { IBaseActor } from '../models/contracts/actors/base'
import { Claim } from '../models/contracts/claims/claim';

interface ClaimSelection {
    factory: () => IBaseClaim,
    instance?: IBaseClaim,
    displayName: string
}
export class Create {
    @computedFrom('contract._id')
    get contractType(): string {
        return (this.contract && this.contract._id) ? 'view' : 'edit';
    }
    public contract = new Claim(null) ;
    public ClaimDropDownOptions: ClaimSelection[];

    public addNew() {
        var create = this;
        return ()=>{
            create.contract = new Claim(null);
        }
    }
}