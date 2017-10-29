import { Contract } from "../models/contracts/contract";
import { IBaseActor } from "../models/contracts/actors/base";

export class ViewModel{

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
}