import { Contract, IContract } from '../models/contracts/contract';
import { Citation } from "../models/contracts/citations/citation";
import { IBaseCitation } from "../models/contracts/citations/base";

export class Cart {
    public contracts: IBaseCitation [] = [];
    constructor() {
        this.load();
    }

    public load() {
        Contract.DataContext.getInstance().allDocs({
            include_docs: true,
            attachments: true
        }).then((results) => {
            this.contracts = results.rows.map((item) => <any>item.doc as IBaseCitation)
                .filter(ref=> ~ref.roles.indexOf("Citation"));
        });
    }

    public refresh() {
        var cart = this;
        return () => {
            cart.load();
        }
    }
}