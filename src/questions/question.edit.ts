import { Contract } from "../models/contracts/contract";
import { IBaseUser } from "../models/contracts/users/base";
import { IBaseQuestion } from "../models/contracts/questions/base";
import { bindable, bindingMode } from 'aurelia-framework';

export class ViewModel {
    public contract: IBaseQuestion;
    public activate(model) {
        this.contract = model;
    }
}