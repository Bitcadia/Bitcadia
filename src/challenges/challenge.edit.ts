import { Contract } from "../models/contracts/contract";
import { Claim } from "../models/contracts/claims/claim";
import { IBaseChallenge } from "../models/contracts/challenges/base";
import {bindable, bindingMode} from 'aurelia-framework';

export class ViewModel{

    public contract: IBaseChallenge;
    public actorOptions: Claim[];
    constructor() {
        Contract.DataContext.getContracts<Claim>(Claim).then((results) => {
            this.actorOptions = results
        });
    }
    public activate(model){
        this.contract = model;
    }
}