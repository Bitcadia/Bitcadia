import { ContractModule } from '../resources/contractModule';
import { Contract } from "../models/contracts/contract";
import { bindable, computedFrom } from 'aurelia-framework';
import { FreeActor } from '../models/contracts/actors/free';
import { SignedActor } from '../models/contracts/actors/signed';
import { IBaseClaim } from '../models/contracts/claims/base'
import { IBaseQuestion } from '../models/contracts/questions/base'
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
    public contract = new Claim(null);
    public ClaimDropDownOptions: ClaimSelection[];

    activate(params) {
        return Contract.DataContext.getInstance().get(params.id)
            .then((question) => this.contract.question = <any>question as IBaseQuestion);
    }
    public addNew() {
        var create = this;
        return () => {
            const question = create.contract.question;
            create.contract = new Claim(null);
            create.contract.question = question;
        }
    }
}