import { Contract, IContract } from '../../models/contracts/contract';
import { Federation } from "../../models/contracts/federations/federation";
import { IBaseFederation } from "../../models/contracts/federations/base";

export class Cart {
    public contracts: IBaseFederation[] = [];
    constructor() {
        this.load();
    }

    public load() {
        Contract.DataContext.getInstance().allDocs({
            include_docs: true,
            attachments: true
        }).then((results) => {
            this.contracts = results.rows.map((item) => <any>item.doc as IBaseFederation)
                .filter(ref => ~ref.roles.indexOf("Federation"));
        });
    }

    public refresh() {
        var cart = this;
        return () => {
            cart.load();
        }
    }
}
