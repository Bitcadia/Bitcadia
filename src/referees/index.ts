import { Contract, IContract } from '../models/contracts/contract';
import { Referee } from "../models/contracts/referees/referee";
import { IBaseReferee } from "../models/contracts/referees/base";

export class Cart {
    public contracts: IBaseReferee [] = [];
    constructor() {
        this.load();
    }

    public load() {
        Contract.DataContext.getInstance().allDocs({
            include_docs: true,
            attachments: true
        }).then((results) => {
            this.contracts = results.rows.map((item) => <any>item.doc as IBaseReferee)
                .filter(ref=> ~ref.roles.indexOf("Referee"));
        });
    }

    public refresh() {
        var cart = this;
        return () => {
            cart.load();
        }
    }
}