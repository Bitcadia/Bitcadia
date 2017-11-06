import { Contract } from "../models/contracts/contract";
import { IBaseActor, BaseActor } from "../models/contracts/actors/base";
import { IBaseJudge } from "../models/contracts/judges/base";
import { IBaseClaim } from "../models/contracts/claims/base";
import { bindable, bindingMode } from 'aurelia-framework';

export class ViewModel {

    public contract: IBaseClaim;
    public actorOptions: IBaseActor[];
    constructor() {
        Contract.DataContext.getContracts<IBaseActor>(BaseActor).then((results) => {
            this.actorOptions = results
        });
    }
    public activate(model) {
        this.contract = model;
    }
}