import { Contract, IContract } from '../models/contracts/contract';

export class Cart {
    public contracts: IContract[] = [];
    constructor() {
        this.load();
    }

    public load() {
        Contract.DataContext.getInstance().allDocs({
            include_docs: true,
            attachments: true
        }).then((results) => {
            this.contracts = results.rows.map((item) => item.doc);
        });
    }

    public refresh() {
        let cart = this;
        return () => {
            cart.load();
        };
    }
}