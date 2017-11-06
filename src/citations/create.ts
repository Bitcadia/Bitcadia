import { ContractModule } from '../resources/contractModule';
import { Contract } from "../models/contracts/contract";
import { bindable, computedFrom } from 'aurelia-framework';
import { IBaseCitation } from '../models/contracts/citations/base'
import { Citation } from '../models/contracts/citations/citation';

interface CitationSelection {
    factory: () => IBaseCitation,
    instance?: IBaseCitation,
    displayName: string
}
export class Create {
    @computedFrom('contract._id')
    get contractType(): string {
        return (this.contract && this.contract._id) ? 'view' : 'edit';
    }
    public contract = new Citation(null);
    public CitationDropDownOptions: CitationSelection[];

    public addNew() {
        var create = this;
        return () => {
            create.contract = new Citation(null);
        }
    }
}