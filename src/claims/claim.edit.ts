import { Contract } from "../models/contracts/contract";
import { IBaseActor, BaseActor } from "../models/contracts/actors/base";
import { IBaseClaim } from "../models/contracts/claims/base";
import {bindable, bindingMode} from 'aurelia-framework';

export class ViewModel{

    public contract: IBaseClaim;
    public actorOptions: IBaseActor[];
    constructor(){
        Contract.DataContext.getContracts<BaseActor>(BaseActor).then((results) => {
            this.actorOptions = results
        });
    }
    public activate(model){
        this.contract = model;
    }
}