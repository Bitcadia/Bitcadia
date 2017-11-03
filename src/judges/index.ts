import { Contract, IContract } from '../models/contracts/contract';
import { Judge } from "../models/contracts/judges/judge";
import { IBaseJudge } from "../models/contracts/judges/base";

export class Cart {
    public contracts: IBaseJudge[] = [];
    constructor() {
        this.load();
    }

    public load() {
        Contract.DataContext.getInstance().allDocs({
            include_docs: true,
            attachments: true
        }).then((results) => {
            this.contracts = results.rows.map((item) => <any>item.doc as IBaseJudge)
                .filter(ref => ~ref.roles.indexOf("Judge"));
        });
    }

    public refresh() {
        var cart = this;
        return () => {
            cart.load();
        }
    }
}