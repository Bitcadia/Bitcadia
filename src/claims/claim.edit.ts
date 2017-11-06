import { Contract } from "../models/contracts/contract";
import { IBaseUser } from "../models/contracts/users/base";
import { User } from "../models/contracts/users/user";
import { IBaseJudge } from "../models/contracts/judges/base";
import { IBaseClaim } from "../models/contracts/claims/base";
import { bindable, bindingMode } from 'aurelia-framework';

export class ViewModel {

    public contract: IBaseClaim;
    public actorOptions: IBaseUser[];
    constructor() {
        Contract.DataContext.getContracts<IBaseUser>(User).then((results) => {
            this.actorOptions = results
        });
    }
    public activate(model) {
        this.contract = model;
    }
}