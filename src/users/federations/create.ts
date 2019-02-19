import { ContractModule } from '../../resources/contractModule';
import { Contract } from "../../models/contracts/contract";
import { bindable, computedFrom } from 'aurelia-framework';
import { IBaseFederation } from '../../models/contracts/federations/base'
import { Federation } from '../../models/contracts/federations/federation';

interface FederationSelection {
    factory: () => IBaseFederation,
    instance?: IBaseFederation,
    displayName: string
}
export class Create {
    @computedFrom('contract._id')
    get contractType(): string {
        return (this.contract && this.contract._id) ? 'view' : 'edit';
    }
    public contract = new Federation(null);
    public FederationDropDownOptions: FederationSelection[];

    public addNew() {
        var create = this;
        return () => {
            create.contract = new Federation(null);
        }
    }
}
