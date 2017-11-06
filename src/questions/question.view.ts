import { Contract } from "../models/contracts/contract";
import { IBaseActor } from "../models/contracts/actors/base";
import { IBaseQuestion } from "../models/contracts/questions/base";
import { bindable, bindingMode, inject } from 'aurelia-framework';
import { Router } from 'aurelia-router';

@inject(Router)
export class ViewModel {
    public contract: IBaseQuestion;
    public router: Router;
    constructor(router: Router) {
        this.router = router;
    }
    public activate(model) {
        this.contract = model;
    }
    public answer() {
        this.router.navigateToRoute("createClaim", { id: this.contract._id });
    }
}