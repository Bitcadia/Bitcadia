import { Contract } from "../models/contracts/contract";
import { Claim } from "../models/contracts/claims/claim";
import { IBaseCitation } from "../models/contracts/citations/base";
import { bindable, bindingMode } from 'aurelia-framework';

export class ViewModel {

    public contract: IBaseCitation;
    public actorOptions: Claim[];
    constructor() {
        Contract.DataContext.getContracts<Claim>(Claim).then((results) => {
            this.actorOptions = results
        });
    }
    public activate(model) {
        this.contract = model;
    }
}