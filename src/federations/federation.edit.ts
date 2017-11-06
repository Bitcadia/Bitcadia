import { Contract } from "../models/contracts/contract";
import { IBaseFederation } from "../models/contracts/federations/base";
import { IBaseUser } from "../models/contracts/users/base";
import { bindable, bindingMode } from 'aurelia-framework';

export class ViewModel {

    public contract: IBaseFederation;
    public actorOptions: IBaseUser[];
    constructor() {
        Contract.DataContext.getInstance().allDocs({
            include_docs: true,
            attachments: true
        }).then((results) => {
            this.actorOptions = results.rows.map((item) => <any>item.doc as IBaseUser)
                .filter(ref => {
                    var roles = ref.roles;
                    return ~roles.indexOf("User");
                });
        });
    }
    public activate(model) {
        this.contract = model;
    }
}