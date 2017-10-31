import { Contract, IContract } from '../models/contracts/contract';
import { Claim } from "../models/contracts/claims/claim";
import { IBaseClaim } from "../models/contracts/claims/base";

export class Cart {
    public contracts: IBaseClaim [] = [];
    constructor() {
        this.load();
    }

    public load() {
        Contract.DataContext.getInstance().allDocs({
            include_docs: true,
            attachments: true
        }).then((results) => {
            this.contracts = results.rows.map((item) => <any>item.doc as IBaseClaim)
                .filter(ref=> ~ref.roles.indexOf("Claim"));
        });
    }

    public refresh() {
        var cart = this;
        return () => {
            cart.load();
        }
    }
}