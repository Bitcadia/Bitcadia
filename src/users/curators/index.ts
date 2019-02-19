import { Contract, IContract } from '../../models/contracts/contract';
import { Challenge } from "../../models/contracts/challenges/challenge";
import { IBaseChallenge } from "../../models/contracts/challenges/base";

export class Cart {
    public contracts: IBaseChallenge[] = [];
    constructor() {
        this.load();
    }

    public load() {
        Contract.DataContext.getInstance().allDocs({
            include_docs: true,
            attachments: true
        }).then((results) => {
            this.contracts = results.rows.map((item) => <any>item.doc as IBaseChallenge)
                .filter(ref => ~ref.roles.indexOf("Challenge"));
        });
    }

    public refresh() {
        var cart = this;
        return () => {
            cart.load();
        }
    }
}
