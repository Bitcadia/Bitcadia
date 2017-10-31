import { Contract } from "../models/contracts/contract";
import { IBaseActor } from "../models/contracts/actors/base";
import { IBaseChallenge } from "../models/contracts/challenges/base";
import {bindable, bindingMode} from 'aurelia-framework';

export class ViewModel{

    public contract: IBaseChallenge;
    public actorOptions: IBaseActor[];
    constructor(){
        Contract.DataContext.getInstance().allDocs({
            include_docs: true,
            attachments: true
        }).then((results) => {
            this.actorOptions = results.rows.map((item) => <any>item.doc as IBaseActor)
                .filter(ref=> { 
                    var roles = ref.roles;
                    return ~roles.indexOf("Actor");
                });
        });
    }
    public activate(model){
        this.contract = model;
    }
}